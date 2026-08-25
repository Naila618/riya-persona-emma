import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const connectionString = `${process.env.DATABASE_URL}`;
console.log("Connecting to:", connectionString.replace(/:[^:@]+@/, ":***@"));

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  try {
    const userCount = await prisma.user.count();
    const emailCount = await prisma.emailItem.count();
    const departmentCount = await prisma.department.count();
    const notificationCount = await prisma.notificationItem.count();
    
    console.log(`Users: ${userCount}`);
    console.log(`Emails: ${emailCount}`);
    console.log(`Departments: ${departmentCount}`);
    console.log(`Notifications: ${notificationCount}`);
    
    console.log("DATA PRESENT: PASS");
  } catch (e) {
    console.error("DATA PRESENT: FAIL", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verify();
