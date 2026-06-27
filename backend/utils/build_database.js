const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // Run: npm install csv-parser
const { 
    sequelize, 
    User, 
    FeatureSet, 
    FeatureFilter, 
    ModelType,
    Job,
    JobFilter,
    MiRnaData,
    MiRnaFeatureValue
} = require('../models/index');

// Load Mock Metadata Seed Files
const usersData = require('users.json');
const featureSetData = require('featureSets.json');
const featureFilterData = require('featureFilters.json');
const modelTypeData = require('modelTypes.json');
const jobData = require('jobs.json'); // Direct JSON source data

// Absolute paths to your raw genomics CSV datasets
// positive it path C:\Users\shira\IdeaProjects\Internet-Project\ml-service\models
const positiveCsvPath = path.join(__dirname, '../../ml-service/data/positive_dataset.csv');
const negativeCsvPath = path.join(__dirname, '../../ml-service/data/negative_dataset.csv');

/**
 * Streams a dataset file row-by-row, maps core identifiers, 
 * and bulk-inserts unmapped descriptor metrics into the EAV table.
 */
const ingestDataset = (filePath, isPositiveDataset) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Dataset file missing at: ${filePath}. Skipping...`);
            return resolve();
        }

        console.log(`⏳ Streaming genomic sequences from: ${path.basename(filePath)}...`);
        const rowBuffer = [];
        let totalRecordsProcessed = 0;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => { rowBuffer.push(row); })
            .on('end', async () => {
                try {
                    for (const row of rowBuffer) {
                        // 1. Resolve identifier alignment: Map negative 'name' -> 'mirgenedb_id'
                        const mirbaseId = row.mirbase_id ? row.mirbase_id.trim() : null;
                        const mirgeneId = isPositiveDataset 
                            ? (row.mirgenedb_id ? row.mirgenedb_id.trim() : null)
                            : (row.name ? row.name.trim() : null);

                        // Skip corrupt rows that violate your check constraint (both IDs empty)
                        if (!mirbaseId && !mirgeneId) {
                            continue; 
                        }

                        // 2. Insert the core record entry
                        const coreRecord = await MiRnaData.create({
                            mirbase_id: mirbaseId,
                            mirgenedb_id: mirgeneId,
                            isPositive: isPositiveDataset ? 1 : 0
                        });

                        // 3. Collect every other column in this row as a dynamic feature row
                        const featureRows = [];
                        for (const [key, value] of Object.entries(row)) {
                            const cleanValue = value ? String(value).trim() : '';

                            if (
                                key !== 'mirbase_id' && 
                                key !== 'mirgenedb_id' && 
                                key !== 'label' &&  // ◄--- SKIP 'label' COLUMN!
                                key !== 'name' && 
                                cleanValue !== '' && 
                                cleanValue !== 'NaN' &&  // ◄--- SKIP 'NaN' STRINGS!
                                cleanValue !== 'null'    // ◄--- SKIP 'null' STRINGS!
                            ) {
                                featureRows.push({
                                    mirnaId: coreRecord.id,
                                    featureName: key,
                                    featureValue: cleanValue
                                });
                            }
                        }

                        // 4. Batch-insert features for performance
                        if (featureRows.length > 0) {
                            await MiRnaFeatureValue.bulkCreate(featureRows);
                        }

                        totalRecordsProcessed++;
                        if (totalRecordsProcessed % 500 === 0) {
                            console.log(`   ...ingested ${totalRecordsProcessed} molecular sequence matrices.`);
                        }
                    }

                    console.log(`✅ Completed ingestion for ${path.basename(filePath)}. Total: ${totalRecordsProcessed} sequences stored.`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => reject(err));
    });
};

const runMasterPipeline = async () => {
    try {
        console.log("🔄 Force-syncing fresh structural database schema tables...");
        await sequelize.authenticate();
        console.log("🔄 Link verified. Wiping and creating clean database structures...");
        await sequelize.sync({ force: true });

        // Fixed column target to 'mirgenedb_id' to match your model layout
        await sequelize.query(`
            ALTER TABLE MiRnaData 
            ADD CONSTRAINT chk_at_least_one_id 
            CHECK (mirbase_id IS NOT NULL OR mirgenedb_id IS NOT NULL);
        `);

        console.log("🌱 Populating lookup core master tables...");
        await FeatureSet.bulkCreate(featureSetData);
        await FeatureFilter.bulkCreate(featureFilterData);
        await ModelType.bulkCreate(modelTypeData);
        console.log("✅ Core lookup tables successfully populated.");

        console.log("🔒 Registering system user profiles (auto-hashed)...");
        await User.bulkCreate(usersData, { validate: true, individualHooks: true });  
        console.log(`✅ Loaded ${usersData.length} user profile contexts.`);

        console.log(`🌱 Processing ${jobData.length} historical training logs...`);
        for (const rawJob of jobData) {
            // 1. Separate the flat legacy filter fields using object destructuring
            const {
                pearsonEnabled,
                pearsonThreshold,
                varianceEnabled,
                varianceThreshold,
                ...coreJobData
            } = rawJob;

            // 2. Insert into the main Job table
            const createdJob = await Job.create(coreJobData);

            // 3. Dynamically pivot filters into the JobFilter many-to-many bridge table
            if (pearsonEnabled && pearsonThreshold !== undefined && pearsonThreshold !== null) {
                await JobFilter.create({
                    jobId: createdJob.jobId,
                    filterId: 1, 
                    thresholdValue: pearsonThreshold
                });
            }

            if (varianceEnabled && varianceThreshold !== undefined && varianceThreshold !== null) {
                await JobFilter.create({
                    jobId: createdJob.jobId,
                    filterId: 2, 
                    thresholdValue: varianceThreshold
                });
            }
        }
        console.log("✅ Historical training records separated and seeded cleanly.");

        // Ingest genomic tables sequentially
        console.log("🧬 Starting microRNA genome data ingestion sequence...");
        await ingestDataset(positiveCsvPath, true);
        await ingestDataset(negativeCsvPath, false);

        console.log("\n✨ Success! All lookups, encrypted profiles, historical job relational splits, and asymmetrical genomics matrices are fully seeded.");
        await sequelize.close();
        process.exit(0);
    } catch (err) {
        console.error("❌ Fatal crash during pipeline synchronization execution:", err);
        process.exit(1);
    }
};

runMasterPipeline();