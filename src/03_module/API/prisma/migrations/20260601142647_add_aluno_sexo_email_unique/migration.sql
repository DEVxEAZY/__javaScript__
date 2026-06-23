/*
  Warnings:

  - Added the required column `sexo` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "peso" REAL NOT NULL,
    "altura" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_alunos" ("altura", "created_at", "email", "id", "idade", "nome", "peso", "sexo", "sobrenome", "updated_at") SELECT "altura", "created_at", "email", "id", "idade", "nome", "peso", 'M', "sobrenome", "updated_at" FROM "alunos";
DROP TABLE "alunos";
ALTER TABLE "new_alunos" RENAME TO "alunos";
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
