// Script to update existing users with short 6-character referral codes
// Run with: npx ts-node scripts/update-referral-codes.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate short 6-character referral code
function generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0,O,1,I
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function updateReferralCodes() {
    console.log('🔄 Starting referral code update...\n');

    // Get all users with long referral codes (more than 6 characters)
    const users = await prisma.user.findMany({
        select: { id: true, email: true, referralCode: true }
    });

    const usersToUpdate = users.filter(u => u.referralCode.length > 6);
    console.log(`Found ${usersToUpdate.length} users with long referral codes\n`);

    const usedCodes = new Set<string>();
    let updated = 0;
    let failed = 0;

    for (const user of usersToUpdate) {
        // Generate unique code
        let newCode = generateReferralCode();
        let attempts = 0;
        while (usedCodes.has(newCode) && attempts < 50) {
            newCode = generateReferralCode();
            attempts++;
        }

        // Check if code already exists in DB
        const existing = await prisma.user.findUnique({ where: { referralCode: newCode } });
        if (existing) {
            console.log(`⚠️  Skipping ${user.email} - code collision`);
            failed++;
            continue;
        }

        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { referralCode: newCode }
            });

            usedCodes.add(newCode);
            console.log(`✅ ${user.email}: ${user.referralCode} → ${newCode}`);
            updated++;
        } catch (error) {
            console.log(`❌ Failed ${user.email}: ${error}`);
            failed++;
        }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏭️  Skipped: ${users.length - usersToUpdate.length} (already short)`);
}

updateReferralCodes()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
