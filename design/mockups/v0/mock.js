// Datos de ejemplo para los mockups v0.
window.MOCK = {
  "policy": {
    "policy": {
      "id": "POL-2026-0042",
      "planId": "PLAN-ESENCIAL",
      "startDate": "2026-01-15",
      "endDate": "2027-01-14",
      "monthlyPremium": 48900,
      "annualPremium": 586800,
      "currency": "COP",
      "insuredProperty": {
        "insuredValue": 180000000
      },
      "coverages": [
        {
          "name": "Incendio y rayo",
          "limit": 120000000,
          "contentId": "CNT-COB-01"
        },
        {
          "name": "Daños por agua",
          "limit": 30000000,
          "contentId": "CNT-COB-02"
        },
        {
          "name": "Hurto con violencia",
          "limit": 15000000,
          "contentId": "CNT-COB-03"
        },
        {
          "name": "Responsabilidad civil",
          "limit": 50000000,
          "contentId": "CNT-COB-04"
        },
        {
          "name": "Asistencia domiciliaria",
          "limit": 1500000,
          "contentId": "CNT-COB-05"
        }
      ],
      "exclusions": [
        {
          "contentId": "CNT-EXC-01"
        },
        {
          "contentId": "CNT-EXC-02"
        },
        {
          "contentId": "CNT-EXC-03"
        },
        {
          "contentId": "CNT-EXC-04"
        },
        {
          "contentId": "CNT-EXC-05"
        }
      ]
    }
  },
  "content": {
    "units": [
      {
        "id": "CNT-COB-01",
        "literalText": "Cláusula 3.1. La Aseguradora indemnizará las pérdidas o daños materiales que sufran los bienes asegurados como consecuencia directa de incendio, explosión accidental o impacto de rayo, hasta el valor asegurado indicado en la carátula de la póliza y previa aplicación del deducible pactado."
      },
      {
        "id": "CNT-COB-02",
        "literalText": "Cláusula 3.2. Se amparan los daños materiales causados por agua proveniente de la rotura, desbordamiento o escape accidental y súbito de tuberías, tanques, aparatos o instalaciones hidráulicas del inmueble asegurado, hasta el sublímite indicado en la carátula."
      },
      {
        "id": "CNT-COB-03",
        "literalText": "Cláusula 3.3. Se amparan las pérdidas de los contenidos asegurados como consecuencia de hurto calificado, entendido como la apropiación con violencia sobre las personas o las cosas, siempre que exista denuncia ante la autoridad competente."
      },
      {
        "id": "CNT-COB-04",
        "literalText": "Cláusula 3.4. La Aseguradora cubre la responsabilidad civil extracontractual en que incurra el asegurado por daños materiales o lesiones causadas a terceros, derivados de la tenencia del inmueble asegurado, hasta el límite indicado en la carátula."
      },
      {
        "id": "CNT-COB-05",
        "literalText": "Anexo de asistencia. Se prestarán servicios de emergencia en plomería, cerrajería, electricidad y vidriería, con un máximo de cuatro (4) eventos por vigencia anual y un límite de $1.500.000 por vigencia, sujetos al pago de un copago por evento."
      },
      {
        "id": "CNT-EXC-01",
        "literalText": "Cláusula 4.1. Se excluyen las pérdidas o daños causados por uso, desgaste natural, deterioro gradual, corrosión, oxidación, humedad progresiva o vicio propio de los bienes."
      },
      {
        "id": "CNT-EXC-02",
        "literalText": "Cláusula 4.2. Se excluyen los daños por agua derivados de filtraciones, goteras o humedad causadas por falta de mantenimiento, reparación o limpieza de techos, canales, bajantes, sellos o impermeabilizaciones."
      },
      {
        "id": "CNT-EXC-03",
        "literalText": "Cláusula 4.3. Se excluyen el hurto simple, la desaparición misteriosa y las pérdidas sin evidencia de violencia sobre las personas o las cosas."
      },
      {
        "id": "CNT-EXC-04",
        "literalText": "Cláusula 4.4. Se excluyen las pérdidas o daños causados con dolo o culpa grave del asegurado, del tomador o de las personas que habiten el inmueble con su consentimiento."
      },
      {
        "id": "CNT-EXC-05",
        "literalText": "Cláusula 4.5. Se excluyen los daños causados a los bienes asegurados por animales domésticos de propiedad o bajo la tenencia del asegurado."
      },
      {
        "id": "TER-DEDUCIBLE",
        "literalText": "Cláusula 6. En toda reclamación se aplicará un deducible del diez por ciento (10 %) del valor de la pérdida indemnizable, con un mínimo de quinientos mil pesos ($500.000) por evento."
      },
      {
        "id": "TER-COPAGO",
        "literalText": "Anexo de asistencia, numeral 5. El asegurado pagará al proveedor un copago de treinta mil pesos ($30.000) por cada evento de asistencia solicitado."
      },
      {
        "id": "TER-PRIMA",
        "literalText": "Cláusula 7. La prima se pagará en fracciones mensuales en las fechas indicadas en la carátula. La mora en el pago producirá la terminación automática del contrato conforme al artículo 1068 del Código de Comercio."
      },
      {
        "id": "TER-VIGENCIA",
        "literalText": "Cláusula 2. La vigencia de la póliza es la indicada en la carátula, iniciando a las 00:00 horas de la fecha de inicio y terminando a las 24:00 horas de la fecha de fin."
      }
    ]
  },
  "simulation": {
    "plans": [
      {
        "name": "Hogar Esencial",
        "coverages": {
          "Incendio y rayo": 120000000,
          "Daños por agua": 30000000,
          "Hurto con violencia": 15000000,
          "Responsabilidad civil": 50000000,
          "Asistencia domiciliaria": "4 servicios/año",
          "Terremoto": null
        }
      },
      {
        "name": "Hogar Plus",
        "coverages": {
          "Incendio y rayo": 180000000,
          "Daños por agua": 40000000,
          "Hurto con violencia": 25000000,
          "Responsabilidad civil": 80000000,
          "Asistencia domiciliaria": "6 servicios/año",
          "Terremoto": 180000000
        }
      },
      {
        "name": "Hogar Total",
        "coverages": {
          "Incendio y rayo": 220000000,
          "Daños por agua": 60000000,
          "Hurto con violencia": 40000000,
          "Responsabilidad civil": 120000000,
          "Asistencia domiciliaria": "Ilimitada",
          "Terremoto": 220000000
        }
      }
    ]
  },
  "notifications": {
    "notifications": [
      {
        "type": "siniestro",
        "date": "2026-10-14T16:20:00",
        "body": "Tu reclamación SIN-2026-0007 avanza: el ajustador irá el 17 de octubre en la mañana."
      },
      {
        "type": "siniestro",
        "date": "2026-10-12T09:05:00",
        "body": "Sube la cotización de la reparación para continuar con tu reclamación."
      },
      {
        "type": "pago",
        "date": "2026-10-15T07:00:00",
        "body": "Recibimos tu pago de $48.900. Tu próximo débito es el 15 de noviembre."
      },
      {
        "type": "educativo",
        "date": "2026-10-05T10:00:00",
        "body": "Te explicamos en 1 minuto la diferencia entre una fuga repentina y una filtración."
      },
      {
        "type": "renovacion",
        "date": "2026-10-01T08:00:00",
        "body": "Desde el 15 de noviembre podrás renovarla. Te avisaremos 60, 30, 15 y 1 día antes."
      }
    ]
  },
  "claims": {
    "claims": [
      {
        "id": "SIN-2026-0007",
        "status": "en-revision",
        "claimedAmount": 2800000
      },
      {
        "id": "SIN-2026-0003",
        "status": "cerrado",
        "claimedAmount": 180000
      },
      {
        "id": "SIN-2026-0001",
        "status": "rechazado",
        "claimedAmount": 2200000
      }
    ]
  }
};
