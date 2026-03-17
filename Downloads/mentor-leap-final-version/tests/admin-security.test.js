import { auth } from './src/lib/firebaseAdmin';

async function testAdminSecurity() {
    console.log("--- Starting Admin Security Audit ---");

    const testCases = [
        { email: 'admin@mentorleap.com', expected: 'admin' },
        { email: 'student@example.com', expected: 'student' }
    ];

    for (const test of testCases) {
        console.log(`\nTesting account: ${test.email}`);
        try {
            const user = await auth.getUserByEmail(test.email);
            const customClaims = user.customClaims || {};

            console.log(`- Role in Custom Claims: ${customClaims.role || 'none'}`);

            if (test.expected === 'admin' && customClaims.role !== 'admin') {
                console.error(`❌ FAILURE: ${test.email} should have admin role but doesn't.`);
            } else if (test.expected === 'student' && customClaims.role === 'admin') {
                console.error(`❌ FAILURE: ${test.email} should NOT have admin role but does.`);
            } else {
                console.log(`✅ SUCCESS: Role matches expectation (${test.expected})`);
            }
        } catch (error) {
            console.log(`- Account ${test.email} not found in Auth system (Skipping)`);
        }
    }
}

testAdminSecurity();
