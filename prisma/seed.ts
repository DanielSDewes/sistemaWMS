import "dotenv/config";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌  Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no .env antes de rodar o seed.",
    );
    process.exit(1);
  }

  // Importa o PrismaClient após o dotenv ter carregado o DATABASE_URL
  const { db } = await import("../src/lib/db");

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ️  Usuário ${email} já existe. Nenhuma ação necessária.`);
    await db.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { name: "Administrador", email, passwordHash, role: "GESTOR" },
  });

  console.log(`✅  Usuário GESTOR criado: ${user.email} (id: ${user.id})`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
