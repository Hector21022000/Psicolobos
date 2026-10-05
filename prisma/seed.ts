/**
 * Nombre del archivo: prisma/seed.ts
 * Descripción: Script de sembrado de datos iniciales demo para la plataforma Psicolobos.
 * Fecha de última modificación: 2026-09-18
 * Autor: Psicolobos Development Team
 */

import { PrismaClient, Role, PatientStatus, SessionModality, SessionStatus, DocumentCategory, DiagnosisSystem, DiagnosisStatus, ReportType, ReportStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de datos demo para Psicolobos...');

  // Limpiar base de datos antes de poblar
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.report.deleteMany();
  await prisma.reportTemplate.deleteMany();
  await prisma.ocrResult.deleteMany();
  await prisma.document.deleteMany();
  await prisma.diagnosisHistory.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.clinicalHistory.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  const commonPasswordHash = await bcrypt.hash('Demo1234!', 12);

  // 1. Crear Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Administrador',
      colegiatura: 'DIR-ADM-001',
      specialty: 'Gestión Clínica & Auditoría',
      phone: '+51 987 654 321',
      address: 'Sede Principal Psicolobos, Lima',
      isActive: true,
    },
  });

  // 2. Crear Psicólogos Demo (5 profesionales)
  const psy1 = await prisma.user.create({
    data: {
      email: 'psicologo@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.PSYCHOLOGIST,
      firstName: 'Dra. Elena',
      lastName: 'Vargas Mendoza',
      colegiatura: 'CPhP 14892',
      specialty: 'Psicología Clínica y Psicoterapia Cognitivo-Conductual',
      phone: '+51 912 345 678',
      address: 'Av. Larco 456, Miraflores, Lima',
      isActive: true,
    },
  });

  const psy2 = await prisma.user.create({
    data: {
      email: 'carlos.silva@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.PSYCHOLOGIST,
      firstName: 'Dr. Carlos',
      lastName: 'Silva Rivas',
      colegiatura: 'CPhP 18230',
      specialty: 'Neuropsicología y Evaluación Infantojuvenil',
      phone: '+51 923 456 789',
      address: 'Calle Las Begonias 120, San Isidro, Lima',
      isActive: true,
    },
  });

  const psy3 = await prisma.user.create({
    data: {
      email: 'mariana.torres@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.PSYCHOLOGIST,
      firstName: 'Dra. Mariana',
      lastName: 'Torres Benítez',
      colegiatura: 'CPhP 20114',
      specialty: 'Terapia Familiar y de Pareja (Sistémica)',
      phone: '+51 934 567 890',
      address: 'Av. Primavera 890, Surco, Lima',
      isActive: true,
    },
  });

  const psy4 = await prisma.user.create({
    data: {
      email: 'roberto.gomez@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.PSYCHOLOGIST,
      firstName: 'Dr. Roberto',
      lastName: 'Gómez Alarcón',
      colegiatura: 'CPhP 09754',
      specialty: 'Psicoterapia Humanista Existencial',
      phone: '+51 945 678 901',
      address: 'Av. Arequipa 2340, Lince, Lima',
      isActive: true,
    },
  });

  const psy5 = await prisma.user.create({
    data: {
      email: 'asistente@demo.local',
      passwordHash: commonPasswordHash,
      role: Role.ASSISTANT,
      firstName: 'Lucía',
      lastName: 'Martínez (Asistente)',
      phone: '+51 956 789 012',
      isActive: true,
    },
  });

  console.log('✅ Usuarios principales creados: admin@demo.local y psicologo@demo.local (Contraseña: Demo1234!)');

  // 3. Crear Pacientes Demo para Dra. Elena Vargas (15 pacientes)
  const patientDataList = [
    { firstName: 'Juan Carlos', lastName: 'Pérez Rodríguez', identityDoc: '45892301', age: 28, gender: 'Masculino', phone: '+51 988 111 222', email: 'juan.perez@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'María Fernanda', lastName: 'Gómez Ruiz', identityDoc: '72384910', age: 34, gender: 'Femenino', phone: '+51 988 222 333', email: 'maria.gomez@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Alejandro', lastName: 'Morales Campos', identityDoc: '10293847', age: 42, gender: 'Masculino', phone: '+51 988 333 444', email: 'alejandro.morales@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Sofia Isabel', lastName: 'Castillo Vega', identityDoc: '76543210', age: 25, gender: 'Femenino', phone: '+51 988 444 555', email: 'sofia.castillo@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Ricardo', lastName: 'Navarro Soto', identityDoc: '09876543', age: 50, gender: 'Masculino', phone: '+51 988 555 666', email: 'ricardo.navarro@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Camila', lastName: 'Flores Díaz', identityDoc: '87654321', age: 19, gender: 'Femenino', phone: '+51 988 666 777', email: 'camila.flores@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Diego Alonso', lastName: 'Paredes Larrea', identityDoc: '65432109', age: 31, gender: 'Masculino', phone: '+51 988 777 888', email: 'diego.paredes@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Luciana', lastName: 'Salazar Bravo', identityDoc: '54321098', age: 29, gender: 'Femenino', phone: '+51 988 888 999', email: 'luciana.salazar@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Gabriel', lastName: 'Mendoza Ugarte', identityDoc: '43210987', age: 38, gender: 'Masculino', phone: '+51 988 999 000', email: 'gabriel.mendoza@example.com', status: PatientStatus.INACTIVE },
    { firstName: 'Valeria', lastName: 'Alvarez Ortiz', identityDoc: '32109876', age: 23, gender: 'Femenino', phone: '+51 977 111 222', email: 'valeria.alvarez@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Mateo', lastName: 'Guerrero Silva', identityDoc: '21098765', age: 16, gender: 'Masculino', phone: '+51 977 222 333', email: 'mateo.guerrero@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Daniela', lastName: 'Rios Cabrera', identityDoc: '10987654', age: 45, gender: 'Femenino', phone: '+51 977 333 444', email: 'daniela.rios@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Joaquín', lastName: 'Vidal Palacios', identityDoc: '01987654', age: 27, gender: 'Masculino', phone: '+51 977 444 555', email: 'joaquin.vidal@example.com', status: PatientStatus.ARCHIVED },
    { firstName: 'Beatriz', lastName: 'Espinoza Cruz', identityDoc: '90123456', age: 36, gender: 'Femenino', phone: '+51 977 555 666', email: 'beatriz.espinoza@example.com', status: PatientStatus.ACTIVE },
    { firstName: 'Esteban', lastName: 'Correa Medina', identityDoc: '89012345', age: 40, gender: 'Masculino', phone: '+51 977 666 777', email: 'esteban.correa@example.com', status: PatientStatus.ACTIVE },
  ];

  const createdPatients = [];
  for (const p of patientDataList) {
    const birthYear = 2026 - p.age;
    const patient = await prisma.patient.create({
      data: {
        psychologistId: psy1.id,
        firstName: p.firstName,
        lastName: p.lastName,
        identityDoc: p.identityDoc,
        birthDate: new Date(`${birthYear}-05-15`),
        gender: p.gender,
        phone: p.phone,
        email: p.email,
        address: 'Av. Primavera 123, Dpto 402, Lima',
        emergencyContact: 'Contacto de Emergencia: +51 999 000 111 (Familiar directo)',
        status: p.status,
      },
    });
    createdPatients.push(patient);
  }

  // 4. Poblar expediente completo del primer paciente (Juan Carlos Pérez Rodríguez)
  const primaryPatient = createdPatients[0];

  // Historia clínica
  await prisma.clinicalHistory.create({
    data: {
      patientId: primaryPatient.id,
      reasonForConsultation: 'El paciente acude refiriendo episodios intensos de ansiedad, taquicardia y pensamientos catastrofistas asociados a sobrecarga laboral y dificultades para conciliar el sueño desde hace 4 meses.',
      currentProblemHistory: 'Paciente de 28 años que manifiesta que hace 4 meses inició nuevo rol directivo. Refiere que la presión por cumplir metas ha generado insomnio de conciliación (3-4 horas de sueño), sudoración palmar, rumiación nocturna y sensación constante de desbordamiento.',
      personalBackground: 'Sin antecedentes de psiquiatrización previa. Refiere episodios menores de estrés durante exámenes universitarios gestionados autónomamente.',
      familyBackground: 'Madre con antecedentes de trastorno de ansiedad generalizada en tratamiento farmacológico. Padre sin antecedentes relevantes.',
      medicalBackground: 'Descarte orgánico realizado por médico internista (10/08/2026): Perfil tiroideo, hemograma y ECG dentro de parámetros normales.',
      psychologicalBackground: 'Evaluación previa en 2022 por orientación vocacional. No terapia previa.',
      educationalHistory: 'Licenciado en Ingeniería de Sistemas (Titulado).',
      workHistory: 'Líder de Desarrollo de Software en empresa de tecnología desde 2024.',
      socialHistory: 'Red de apoyo social compuesta por pareja estable de 3 años y grupo cercano de amigos universitarios.',
      familyRelationships: 'Relación cercana con la madre; comunicación funcional con el padre.',
      habits: 'Consumo de café elevado (4-5 tazas diarias). No fuma. Consumo social ocasional de alcohol. Sedentario.',
      riskFactors: 'Elevado perfeccionismo, consumo excesivo de cafeína, privación crónica de sueño.',
      protectiveFactors: 'Buena red de soporte afectivo, conciencia de enfermedad y alta motivación para la psicoterapia.',
      clinicalObservations: 'Paciente lucido, orientado en tiempo, espacio y persona. Discurso coherente, normofluido. AFecto ansioso congruente con el motivo de consulta.',
      interventionPlan: 'Psicoterapia Cognitivo-Conductual (12 sesiones estimadas): Reestructuración cognitiva, higiene del sueño, entrenamiento en respiración diafragmática y desactivación fisiológica, modulación de conducta de trabajo.',
      updatedByUserId: psy1.id,
    },
  });

  // Sesiones clínicas
  const session1 = await prisma.session.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      sessionDate: new Date('2026-08-20T10:00:00Z'),
      startTime: '10:00',
      durationMinutes: 50,
      modality: SessionModality.PRESENCIAL,
      status: SessionStatus.COMPLETED,
      objective: 'Entrevista clínica inicial, encuadre terapéutico y recogida de anamnesis.',
      observations: 'El paciente se muestra colaborador aunque visiblemente tenso (movimiento constante de piernas).',
      interventions: 'Aplicación de psicoeducación sobre el modelo cognicion-afecto-fisiologia de la ansiedad. Registro de pensamientos automáticos.',
      patientResponse: 'Comprende el modelo y manifiesta alivio al entender la naturaleza de sus síntomas fisiológicos.',
      evolution: 'Establecimiento de alianza terapéutica positiva.',
      assignedHomework: 'Autorregistro de episodios de ansiedad (Antecedente - Pensamiento - Reacción - Consecuencia). Reducción de café a máximo 2 tazas.',
      agreements: 'Frecuencia semanal de sesiones los días jueves a las 10:00 AM.',
      privateNotes: 'Revisar la dinámica de exigencia autoproyectada ligada a la figura materna.',
    },
  });

  const session2 = await prisma.session.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      sessionDate: new Date('2026-08-27T10:00:00Z'),
      startTime: '10:00',
      durationMinutes: 50,
      modality: SessionModality.PRESENCIAL,
      status: SessionStatus.COMPLETED,
      objective: 'Entrenamiento en respiración diafragmática y revisión de registros de ansiedad.',
      observations: 'Reporta haber cumplido con la reducción de cafeína a 2 tazas diarias con mejoría leve en el sueño.',
      interventions: 'Práctica guiada de respiración 4-7-8 y técnica de desmitificación de pensamientos catastróficos.',
      patientResponse: 'Logra reducir la frecuencia cardíaca percibida durante la práctica en sesión.',
      evolution: 'Menor reactividad fisiológica ante disparadores laborales.',
      assignedHomework: 'Práctica diaria de respiración 10 minutos antes de dormir y al despertar.',
      agreements: 'Continuar con el registro de pensamientos distorsionados.',
      privateNotes: 'Se observa buena adherencia a las tareas conductuales.',
    },
  });

  const session3 = await prisma.session.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      sessionDate: new Date('2026-09-03T10:00:00Z'),
      startTime: '10:00',
      durationMinutes: 50,
      modality: SessionModality.VIRTUAL,
      status: SessionStatus.COMPLETED,
      objective: 'Reestructuración cognitiva de sesgos de catastrofización y sesgo de exigencia.',
      observations: 'Sesión virtual fluida. El paciente comparte pantalla con sus autorregistros estructurados.',
      interventions: 'Técnica de la flecha descendente y cuestionamiento socrático sobre la probabilidad real de error catastrófico en el trabajo.',
      patientResponse: 'Identifica pensamiento central: "Si cometo un error, demostraré que no estoy capacitado".',
      evolution: 'Inflexión cognitiva positiva; mayor flexibilidad ante eventualidades de trabajo.',
      assignedHomework: 'Experimento conductual: delegar 1 tarea secundaria sin supervisión constante.',
      agreements: 'Programar aplicación del inventario de ansiedad BAI para la siguiente sesión.',
      privateNotes: 'Analizar avance en medición estandarizada.',
    },
  });

  // Próxima sesión agendada para hoy/esta semana
  await prisma.session.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      sessionDate: new Date('2026-09-18T10:00:00Z'),
      startTime: '10:00',
      durationMinutes: 50,
      modality: SessionModality.PRESENCIAL,
      status: SessionStatus.SCHEDULED,
      objective: 'Evaluación de progreso del experimento conductual y aplicación de escala de ansiedad.',
    },
  });

  // 5. Evaluaciones psicológicas para el paciente
  await prisma.evaluation.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      evaluationName: 'Inventario de Ansiedad de Beck (BAI)',
      instrumentName: 'Beck Anxiety Inventory (BAI)',
      version: '1.0',
      evaluationDate: new Date('2026-08-21T11:00:00Z'),
      evaluatorName: 'Dra. Elena Vargas Mendoza',
      reason: 'Medición de la intensidad de la sintomatología ansiosa al inicio del tratamiento.',
      scoresJson: JSON.stringify({ totalScore: 28, somaticScore: 16, cognitiveScore: 12 }),
      percentilesJson: JSON.stringify({ percentile: 85 }),
      scalesJson: JSON.stringify([
        { scaleName: 'Ansiedad Fisiológica / Somática', rawScore: 16, level: 'Moderado - Severo' },
        { scaleName: 'Ansiedad Subjetiva / Cognitiva', rawScore: 12, level: 'Moderado' },
      ]),
      qualitativeObservations: 'El paciente puntúa elevado en ítems referentes a sensación de entumecimiento, sofocación y temor a perder el control.',
      clinicalInterpretation: 'Los resultados ubican al paciente en la categoría de Ansiedad Moderadamente Severa (Puntuación 28/63), justificando la intervención psicoterapéutica Cognitivo-Conductual activa.',
    },
  });

  // 6. Diagnóstico registrado (CIE-11 y DSM-5-TR)
  const diag1 = await prisma.diagnosis.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      system: DiagnosisSystem.CIE_11,
      code: '6B00',
      name: 'Trastorno de ansiedad generalizada',
      description: 'Ansiedad y preocupación excesivas, persistentes y difíciles de controlar sobre múltiples eventos o actividades cotidianas.',
      status: DiagnosisStatus.CONFIRMED,
      isPrimary: true,
      clinicalNotes: 'Cumple criterios CIE-11 por síntoma sostenido mayor a 4 meses con tensión motora y sobreactivación vegetativa.',
    },
  });

  await prisma.diagnosisHistory.create({
    data: {
      diagnosisId: diag1.id,
      previousStatus: DiagnosisStatus.HYPOTHESIS,
      newStatus: DiagnosisStatus.CONFIRMED,
      changedByUserId: psy1.id,
      reason: 'Confirmación tras revisión de anamnesis, descarte médico sintomático y puntaje 28 en Inventario BAI.',
    },
  });

  // 7. Documento subido y resultado de OCR demo
  const doc1 = await prisma.document.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      fileName: 'Evaluacion_Psicologica_Fisica_Firma.png',
      fileType: 'image/png',
      fileSize: 458200,
      fileUrl: '/uploads/demo/evaluacion_fisica.png',
      category: DocumentCategory.TEST,
      description: 'Fotografía de hoja de respuestas manuscrita del Inventario de Ansiedad.',
      version: 1,
    },
  });

  await prisma.ocrResult.create({
    data: {
      documentId: doc1.id,
      rawExtractedText: `INVENTARIO DE ANSIEDAD DE BECK (BAI)
Paciente: Juan Carlos Pérez Rodríguez
Fecha: 21/08/2026
Respuestas registradas:
1. Novedad o adormecimiento: 2 (Moderadamente)
2. Sensacion de calor: 2 (Moderadamente)
3. Temblor en las piernas: 1 (Levemente)
4. Incapaz de relajarse: 3 (Severamente)
5. Temor a que ocurra lo peor: 3 (Severamente)
6. Mareo o aturdimiento: 1 (Levemente)
7. Palpitaciones o aceleracion del corazon: 3 (Severamente)
Puntuacion Total Calculada: 28 puntos.
Observaciones del evaluador: El evaluado expresa sentir miedo constante a fallar en el trabajo.`,
      editedText: `INVENTARIO DE ANSIEDAD DE BECK (BAI)
Paciente: Juan Carlos Pérez Rodríguez
Fecha: 21/08/2026
Respuestas registradas:
1. Entumecimiento o adormecimiento: 2 (Moderadamente)
2. Sensación de calor: 2 (Moderadamente)
3. Temblor en las piernas: 1 (Levemente)
4. Incapaz de relajarse: 3 (Severamente)
5. Temor a que ocurra lo peor: 3 (Severamente)
6. Mareo o aturdimiento: 1 (Levemente)
7. Palpitaciones o aceleración del corazón: 3 (Severamente)
Puntuación Total Calculada: 28 puntos.
Observaciones clínicas: El evaluado manifiesta aprensión constante a la comisión de errores laborales.`,
      extractedFields: JSON.stringify({
        patientName: 'Juan Carlos Pérez Rodríguez',
        evaluationDate: '2026-08-21',
        totalScore: 28,
        interpretation: 'Ansiedad Moderadamente Severa',
      }),
      confidenceScore: 0.94,
    },
  });

  // 8. Informe Psicológico generado
  await prisma.report.create({
    data: {
      patientId: primaryPatient.id,
      psychologistId: psy1.id,
      reportNumber: 'INF-2026-0089',
      title: 'Informe Psicológico de Evolución Clínica',
      reportType: ReportType.EVOLUTION_REPORT,
      contentHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #2d5141; border-bottom: 2px solid #528970; padding-bottom: 8px;">INFORME PSICOLÓGICO DE EVOLUCIÓN CLÍNICA</h2>
        <p><strong>Paciente:</strong> Juan Carlos Pérez Rodríguez | <strong>Edad:</strong> 28 años</p>
        <p><strong>Fecha de Emisión:</strong> 18 de Septiembre de 2026</p>
        <p><strong>Profesional Responsable:</strong> Dra. Elena Vargas Mendoza (CPhP 14892)</p>
        <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
        <h3>1. MOTIVO DE CONSULTA Y ANTECEDENTES</h3>
        <p>El paciente acudió a consulta refiriendo sintomatología ansiosa elevada caracterizada por insomnio de conciliación, reactividad neurovegetativa y rumiación obsesiva respecto al desempeño laboral.</p>
        <h3>2. EVALUACIÓN Y DIAGNÓSTICO</h3>
        <p>Mediante el Inventario BAI (Puntuación: 28) y la entrevista clínica se confirmó el diagnóstico de <strong>Trastorno de Ansiedad Generalizada (CIE-11: 6B00)</strong>.</p>
        <h3>3. EVOLUCIÓN PSICOTERAPÉUTICA</h3>
        <p>Tras 3 sesiones de Psicoterapia Cognitivo-Conductual, el paciente presenta adherencia adecuada a las pautas de higiene del sueño y técnicas de desactivación fisiológica. Se observa incremento en la flexibilidad cognitiva y reducción sostenida de los episodios de taquicardia nocturna.</p>
        <h3>4. RECOMENDACIONES</h3>
        <p>Se recomienda dar continuidad al plan de intervención semanal enfocado en la delegación de responsabilidades y reestructuración de exigencias perfeccionistas.</p>
      </div>`,
      status: ReportStatus.FINALIZED,
      pdfUrl: '/reports/demo_inf_0089.pdf',
    },
  });

  // 9. Citas adicionales para la agenda de la Dra. Elena Vargas
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  await prisma.appointment.createMany({
    data: [
      {
        patientId: createdPatients[0].id,
        psychologistId: psy1.id,
        title: 'Sesión Psicológica - Juan Carlos Pérez',
        startDateTime: new Date(`${dateStr}T09:00:00Z`),
        endDateTime: new Date(`${dateStr}T09:50:00Z`),
        modality: SessionModality.PRESENCIAL,
        status: SessionStatus.CONFIRMED,
      },
      {
        patientId: createdPatients[1].id,
        psychologistId: psy1.id,
        title: 'Sesión Psicológica - María Fernanda Gómez',
        startDateTime: new Date(`${dateStr}T11:00:00Z`),
        endDateTime: new Date(`${dateStr}T11:50:00Z`),
        modality: SessionModality.VIRTUAL,
        status: SessionStatus.SCHEDULED,
      },
      {
        patientId: createdPatients[2].id,
        psychologistId: psy1.id,
        title: 'Evaluación Neuropsicológica - Alejandro Morales',
        startDateTime: new Date(`${dateStr}T15:00:00Z`),
        endDateTime: new Date(`${dateStr}T15:50:00Z`),
        modality: SessionModality.PRESENCIAL,
        status: SessionStatus.SCHEDULED,
      },
      {
        patientId: createdPatients[3].id,
        psychologistId: psy1.id,
        title: 'Sesión Psicológica - Sofia Isabel Castillo',
        startDateTime: new Date(`${dateStr}T17:00:00Z`),
        endDateTime: new Date(`${dateStr}T17:50:00Z`),
        modality: SessionModality.PRESENCIAL,
        status: SessionStatus.SCHEDULED,
      },
    ],
  });

  // 10. Registros de Auditoría demo
  await prisma.auditLog.createMany({
    data: [
      {
        userId: psy1.id,
        targetPatientId: primaryPatient.id,
        action: 'VIEW_PATIENT_RECORD',
        resource: `/pacientes/${primaryPatient.id}`,
        details: 'Consulta de expediente completo por la psicóloga titular.',
        result: 'SUCCESS',
      },
      {
        userId: psy1.id,
        targetPatientId: primaryPatient.id,
        action: 'RUN_OCR',
        resource: `/documentos/${doc1.id}`,
        details: 'Procesamiento OCR exitoso de documento de evaluación.',
        result: 'SUCCESS',
      },
      {
        userId: adminUser.id,
        action: 'ADMIN_VIEW_AUDIT',
        resource: '/admin/audit',
        details: 'Super Admin revisó la lista general de auditoría del sistema.',
        result: 'SUCCESS',
      },
    ],
  });

  console.log('✅ Base de datos sembrada con éxito con 5 psicólogos demo, 15 pacientes ficticios, expedientes, sesiones, OCR e informes.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el sembrado de base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
