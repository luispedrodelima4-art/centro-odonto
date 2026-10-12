import bcrypt from 'bcrypt';
import { prisma } from '../src/shared/infrastructure/database/prisma.js';

const DEFAULT_PROCEDURES = [
  { name: 'Profilaxia e Raspagem (Limpeza Completa)', category: 'PREVENTIVE', priceInCents: 18000, description: 'Remoção de tártaro e biofilme dental com ultrassom e jato de bicarbonato' },
  { name: 'Aplicação Tópica de Flúor', category: 'PREVENTIVE', priceInCents: 9000, description: 'Remineralização do esmalte dental' },
  { name: 'Restauração Resina Composta (1 Face)', category: 'RESTORATIVE', priceInCents: 16000, description: 'Restauração estética direta em resina nanohíbrida' },
  { name: 'Restauração Resina Composta (2 Faces)', category: 'RESTORATIVE', priceInCents: 22000, description: 'Restauração estética proximal (MO, DO)' },
  { name: 'Restauração Resina Composta (3 Faces ou Mais)', category: 'RESTORATIVE', priceInCents: 28000, description: 'Reconstrução extensa MOD ou cúspide' },
  { name: 'Tratamento de Canal Unirradicular', category: 'ENDODONTICS', priceInCents: 45000, description: 'Tratamento endodôntico de incisivos e caninos' },
  { name: 'Tratamento de Canal Multirradicular (Molares)', category: 'ENDODONTICS', priceInCents: 85000, description: 'Instrumentação rotatória e obturação termoplastificada' },
  { name: 'Exodontia Simples (Extração de Dente)', category: 'SURGERY', priceInCents: 18000, description: 'Remoção cirúrgica de elemento dentário' },
  { name: 'Exodontia de Terceiro Molar (Siso Incluso)', category: 'SURGERY', priceInCents: 45000, description: 'Cirurgia com odontossecção e osteotomia' },
  { name: 'Clareamento Dental em Consultório', category: 'AESTHETICS', priceInCents: 90000, description: 'Sessão com gel clareador de alta concentração' },
  { name: 'Coroa Protética Cerâmica (Zircônia/E-max)', category: 'PROSTHESIS', priceInCents: 150000, description: 'Prótese fixa livre de metal' },
  { name: 'Implante Dentário Unitário', category: 'IMPLANT', priceInCents: 180000, description: 'Instalação cirúrgica de implante osseointegrado de titânio' },
];

// FDI 32 adult teeth (11-18, 21-28, 31-38, 41-48)
const ALL_TEETH_NUMBERS = [
  11, 12, 13, 14, 15, 16, 17, 18,
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
];

async function seed() {
  console.log('🌱 Starting comprehensive database seed for Centro Odonto...');

  // 1. Clinic User: Dr. Carlos Eduardo
  const adminEmail = 'carlos.eduardo@centroodonto.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Dr. Carlos Eduardo',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        councilId: 'CRO-SP 123456',
        isActive: true,
      },
    });
    console.log(`✅ Default admin created: ${admin.email}`);
  }

  // 2. Procedure Catalog
  for (const proc of DEFAULT_PROCEDURES) {
    const existing = await prisma.procedureCatalog.findFirst({
      where: { name: proc.name },
    });
    if (!existing) {
      await prisma.procedureCatalog.create({ data: proc });
    }
  }
  console.log('✅ Procedure catalog ready');

  // 3. Default Patient: Mariana Silva Costa
  const patientCpf = '12345678901';
  let patient = await prisma.patient.findUnique({ where: { documentCpf: patientCpf } });
  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        fullName: 'Mariana Silva Costa',
        documentCpf: patientCpf,
        birthDate: new Date('1995-04-12'),
        phoneNumber: '11987654321',
        email: 'mariana.costa@email.com',
      },
    });
    console.log(`✅ Patient Mariana Silva Costa created: ${patient.id}`);
  }

  // 4. Clinical Record and 32 Teeth for Mariana
  let record = await prisma.patientRecord.findUnique({
    where: { patientId: patient.id },
    include: { odontogram: { include: { teeth: true } } },
  });

  if (!record) {
    record = await prisma.patientRecord.create({
      data: {
        patientId: patient.id,
        medicalAlerts: ['Alergia a Penicilina', 'Hipotensão postural'],
        odontogram: {
          create: {
            dentitionType: 'PERMANENT',
            teeth: {
              create: ALL_TEETH_NUMBERS.map((num) => ({
                toothNumber: num,
                condition: num === 16 ? 'CARIOUS' : num === 24 ? 'RESTORED' : 'SOUND',
                notes: num === 16 ? 'Lesão oclusal média' : undefined,
              })),
            },
          },
        },
      },
      include: { odontogram: { include: { teeth: true } } },
    });
    console.log(`✅ Clinical record & 32 teeth initialized for Mariana`);
  }

  // Initial Progress Note
  const existingNote = await prisma.clinicalProgressNote.findFirst({
    where: { patientRecordId: record.id },
  });
  if (!existingNote) {
    await prisma.clinicalProgressNote.create({
      data: {
        patientRecordId: record.id,
        authorId: admin.id,
        professionalName: admin.name,
        text: 'Paciente compareceu para avaliação de rotina. Queixa de sensibilidade a doces no dente 16. Exame clínico revelou cárie oclusal no 16. Planejado preparo cavitário e restauração em resina composta. Dente 24 apresenta restauração prévia íntegra.',
        isSigned: true,
        digitalSignatureHash: 'a7b3c9d2e1f4085b1a2ee77d9e1a9e5046aea78b612544f48ee70d5e4279746f',
        signedAt: new Date(),
      },
    });
    console.log(`✅ Initial clinical progress note signed and created`);
  }

  // 5. Additional Patients for realistic clinic list
  const otherPatients = [
    { name: 'Roberto de Andrade', cpf: '98765432100', birth: '1982-11-20', phone: '11977778888', email: 'roberto.andrade@email.com' },
    { name: 'Ana Clara Fernandes', cpf: '45678912355', birth: '2001-08-05', phone: '11966665555', email: 'ana.fernandes@email.com' },
    { name: 'Lucas Gabriel Moreira', cpf: '78912345688', birth: '1990-03-14', phone: '11955554444', email: 'lucas.moreira@email.com' },
  ];

  for (const p of otherPatients) {
    const exists = await prisma.patient.findUnique({ where: { documentCpf: p.cpf } });
    if (!exists) {
      const created = await prisma.patient.create({
        data: {
          fullName: p.name,
          documentCpf: p.cpf,
          birthDate: new Date(p.birth),
          phoneNumber: p.phone,
          email: p.email,
        },
      });

      await prisma.patientRecord.create({
        data: {
          patientId: created.id,
          medicalAlerts: [],
          odontogram: {
            create: {
              dentitionType: 'PERMANENT',
              teeth: {
                create: ALL_TEETH_NUMBERS.map((num) => ({
                  toothNumber: num,
                  condition: 'SOUND',
                })),
              },
            },
          },
        },
      });
    }
  }

  console.log('🎉 Comprehensive seed successfully completed!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
