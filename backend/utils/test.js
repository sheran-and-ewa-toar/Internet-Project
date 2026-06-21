const { Job, FeatureFilter, MiRnaData, MiRnaFeatureValue } = require('../models');

async function testQueryLayers() {
    try {
        console.log("🔍 Running backend architectural validation tests...\n");

        // Test 1: Check a relational job with its filters
        const testJob = await Job.findOne({
            include: [{ model: FeatureFilter, as: 'appliedFilters' }]
        });
        if (testJob) {
            console.log(`✅ Job Relational Layer OK. Job #${testJob.jobId} pulled with ${testJob.appliedFilters?.length || 0} active relational filters.`);
        } else {
            console.log("⚠️ No jobs found to evaluate.");
        }

        // Test 2: Evaluate EAV Pivot mapping
        const positiveSample = await MiRnaData.findOne({
            where: { isPositive: 1 },
            include: [{ model: MiRnaFeatureValue, as: 'features', limit: 3 }]
        });
        
        if (positiveSample) {
            console.log(`✅ EAV Mapping Layer OK. Core ID ${positiveSample.id} (${positiveSample.mirgenedb_id || 'No Gene ID'}) fetched child features successfully.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Validation script discovered a schema issue:", error);
        process.exit(1);
    }
}

testQueryLayers();