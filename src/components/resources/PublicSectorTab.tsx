import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, BookOpen, FileText, Building2, Calculator, Scale, Landmark, GraduationCap, AlertCircle, Globe } from "lucide-react";

const oposicionesInfo = {
  spain: {
    mainPortals: [
      { name: "Administración General del Estado (AGE)", url: "https://administracion.gob.es/pag_Home/empleoPublico.html", description: "Portal oficial con todas las convocatorias de oposiciones estatales", featured: true },
      { name: "BOE - Empleo Público", url: "https://www.boe.es/buscar/boe_empleo.php", description: "Boletín Oficial del Estado - convocatorias oficiales", featured: true },
      { name: "Cuerpo Superior de Interventores y Auditores del Estado", url: "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/informaciongeneral/Paginas/cuerpointervaudit.aspx", description: "IGAE - máxima categoría en control financiero público (Grupo A1)", featured: true },
      { name: "Inspectores de Hacienda del Estado", url: "https://www.agenciatributaria.es/AEAT.internet/Inicio/La_Agencia_Tributaria/Empleo_Publico.shtml", description: "AEAT - Inspección fiscal y aduanera (Grupo A1)" },
      { name: "Técnicos de Hacienda", url: "https://www.agenciatributaria.es/AEAT.internet/Inicio/La_Agencia_Tributaria/Empleo_Publico.shtml", description: "AEAT - Gestión tributaria (Grupo A2)" },
      { name: "Banco de España - Empleo", url: "https://www.bde.es/bde/es/secciones/sobreelbanco/Trabaja_en_el_B/", description: "Procesos selectivos para el supervisor bancario español" },
      { name: "CNMV - Ofertas de Empleo", url: "https://www.cnmv.es/portal/quees/Empleo/Empleo.aspx", description: "Comisión Nacional del Mercado de Valores" },
    ],
    categories: [
      { name: "Interventores y Auditores del Estado", group: "A1", salary: "40.000€ - 70.000€", difficulty: "Muy Alta", duration: "3-5 años", description: "Control financiero del sector público. La oposición más prestigiosa en finanzas públicas.", topics: ["Contabilidad Pública", "Derecho Administrativo", "Auditoría", "Presupuestos Generales"] },
      { name: "Inspectores de Hacienda del Estado", group: "A1", salary: "45.000€ - 80.000€", difficulty: "Muy Alta", duration: "3-5 años", description: "Inspección fiscal y tributaria. Alta retribución y prestigio.", topics: ["Sistema Tributario", "Contabilidad", "Derecho Financiero", "Economía"] },
      { name: "Técnicos de Hacienda", group: "A2", salary: "28.000€ - 45.000€", difficulty: "Alta", duration: "2-3 años", description: "Gestión y liquidación tributaria. Buena relación preparación/beneficio.", topics: ["Fiscalidad", "Contabilidad", "Derecho Tributario"] },
      { name: "Técnicos de Auditoría y Contabilidad", group: "A2", salary: "25.000€ - 40.000€", difficulty: "Media-Alta", duration: "2-3 años", description: "Control interno en organismos públicos.", topics: ["Contabilidad Pública", "Auditoría", "Presupuestos"] },
      { name: "Gestión de la Administración Civil", group: "A2", salary: "25.000€ - 38.000€", difficulty: "Media", duration: "1.5-2 años", description: "Administración general con orientación económica.", topics: ["Derecho Administrativo", "Gestión Pública", "Hacienda Pública"] },
    ],
  },
  eu: {
    portals: [
      { name: "EPSO - European Personnel Selection Office", url: "https://epso.europa.eu/", description: "Portal oficial para trabajar en instituciones europeas", featured: true },
      { name: "European Central Bank - Careers", url: "https://www.ecb.europa.eu/careers/html/index.en.html", description: "Oportunidades en el BCE - Frankfurt", featured: true },
      { name: "European Investment Bank - Jobs", url: "https://www.eib.org/en/about/careers/index.htm", description: "BEI - financiación de proyectos europeos - Luxemburgo" },
      { name: "European Court of Auditors", url: "https://www.eca.europa.eu/en/Pages/JobOpportunities.aspx", description: "Tribunal de Cuentas Europeo - auditoría de fondos UE" },
      { name: "European Commission - DG ECFIN", url: "https://economy-finance.ec.europa.eu/index_en", description: "Dirección General de Asuntos Económicos y Financieros" },
    ],
  },
};

const books = [
  { name: "Temarios Adams - Interventores y Auditores", publisher: "Adams", description: "Temario oficial completo para la oposición IGAE", url: "https://www.adams.es/", category: "Temario" },
  { name: "Temarios CEF - Inspectores de Hacienda", publisher: "CEF", description: "Material de preparación para AEAT", url: "https://www.cef.es/", category: "Temario" },
  { name: "Contabilidad Pública (Plan General de Contabilidad Pública)", publisher: "Oficial", description: "PGCP - normativa contable del sector público español", url: "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/ContabilidadPublica/Paginas/PlanGeneralContabilidadPublica.aspx", category: "Normativa" },
  { name: "Ley General Presupuestaria", publisher: "BOE", description: "Ley 47/2003 - marco legal de presupuestos públicos", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2003-21614", category: "Normativa" },
  { name: "Manual de Auditoría del Sector Público", publisher: "IGAE", description: "Normas técnicas de auditoría pública", url: "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/ClsNormativa/NormasControlInterno/Paginas/inicio.aspx", category: "Técnico" },
];

const academies = [
  { name: "CEF - Centro de Estudios Financieros", url: "https://www.cef.es/es/oposiciones", description: "Líder en preparación de oposiciones financieras y tributarias", specialties: ["Hacienda", "TAC", "Interventores"], featured: true },
  { name: "Adams Formación", url: "https://www.adams.es/", description: "Preparación integral de oposiciones con amplia tradición", specialties: ["Todas las categorías"] },
  { name: "Centro de Estudios Garrigues", url: "https://centrogarrigues.com/", description: "Formación jurídica y tributaria de alto nivel", specialties: ["Inspectores", "Abogacía del Estado"] },
  { name: "Escuela de Hacienda Pública", url: "https://www.ief.es/", description: "Instituto de Estudios Fiscales - formación oficial", specialties: ["Funcionarios en activo"] },
];

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-8">
    <h4 className="mono font-bold text-lg mb-4 flex items-center gap-2">{icon}{title}</h4>
    {children}
  </div>
);

export const PublicSectorTab = () => {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      {/* Header */}
      <div className="mb-6 p-4 border-2 border-primary bg-primary/10">
        <div className="flex items-start gap-3">
          <Landmark className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="mono font-bold text-primary mb-2">OPOSICIONES: CARRERA EN EL SECTOR PÚBLICO</h3>
            <p className="mono text-sm mb-3">Estabilidad laboral, buen salario y conciliación. Las oposiciones de finanzas y contabilidad pública son una alternativa sólida al sector privado con excelentes condiciones a largo plazo.</p>
            <p className="mono text-xs opacity-80"><span className="text-primary">Realidad:</span> Requieren 2-5 años de preparación intensa, pero ofrecen empleo de por vida, horarios razonables y salarios competitivos.</p>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      <div className="mb-6 p-4 border-2 border-yellow-500/50 bg-yellow-500/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="mono text-sm text-yellow-500 font-bold mb-1">CONVOCATORIAS ABIERTAS</p>
            <p className="mono text-xs opacity-80">Consulta regularmente el BOE y los portales oficiales. Las convocatorias suelen publicarse entre enero y marzo, con exámenes entre septiembre y diciembre.</p>
          </div>
        </div>
      </div>

      {/* Main Portals Spain */}
      <Section title="PORTALES OFICIALES - ESPAÑA" icon={<Globe className="w-5 h-5 text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          {oposicionesInfo.spain.mainPortals.map((portal) => (
            <a key={portal.name} href={portal.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${portal.featured ? 'border-primary' : 'border-foreground'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Building2 className="w-4 h-4 text-primary" />
                    <div className="flex items-center gap-2">{portal.featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">ESENCIAL</span>}<ExternalLink className="w-4 h-4 opacity-50" /></div>
                  </div>
                  <CardTitle className="mono text-base mt-2">{portal.name}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription className="mono text-sm">{portal.description}</CardDescription></CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="OPOSICIONES EN FINANZAS Y CONTABILIDAD" icon={<Calculator className="w-5 h-5 text-primary" />}>
        <div className="space-y-4">
          {oposicionesInfo.spain.categories.map((cat) => (
            <Card key={cat.name} className="bg-black border-2 border-foreground">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="mono text-base">{cat.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap"><span className="mono text-xs px-2 py-1 bg-primary/20 text-primary">Grupo {cat.group}</span><span className="mono text-xs px-2 py-1 bg-foreground/20">{cat.salary}</span></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="mono text-sm opacity-80">{cat.description}</p>
                <div className="flex flex-wrap gap-4 text-xs mono"><span className="opacity-70"><span className="text-primary">Dificultad:</span> {cat.difficulty}</span><span className="opacity-70"><span className="text-primary">Preparación:</span> {cat.duration}</span></div>
                <div className="flex flex-wrap gap-2">{cat.topics.map((topic) => (<span key={topic} className="mono text-xs px-2 py-1 border border-foreground/30">{topic}</span>))}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* EU Opportunities */}
      <Section title="INSTITUCIONES EUROPEAS" icon={<Landmark className="w-5 h-5 text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          {oposicionesInfo.eu.portals.map((portal) => (
            <a key={portal.name} href={portal.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${portal.featured ? 'border-primary' : 'border-foreground'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Scale className="w-4 h-4 text-primary" />
                    <div className="flex items-center gap-2">{portal.featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">TOP</span>}<ExternalLink className="w-4 h-4 opacity-50" /></div>
                  </div>
                  <CardTitle className="mono text-base mt-2">{portal.name}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription className="mono text-sm">{portal.description}</CardDescription></CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      {/* Books & Resources */}
      <Section title="MATERIAL Y NORMATIVA" icon={<BookOpen className="w-5 h-5 text-primary" />}>
        <div className="space-y-2">
          {books.map((book) => (
            <a key={book.name} href={book.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border-2 border-foreground hover:border-primary transition-colors">
              <div className="flex items-center gap-4"><FileText className="w-5 h-5 text-primary" /><div><p className="mono font-bold">{book.name}</p><p className="mono text-xs opacity-70">{book.description}</p></div></div>
              <div className="flex items-center gap-2"><span className="mono text-xs px-2 py-1 bg-foreground/20">{book.category}</span><ExternalLink className="w-4 h-4 opacity-50" /></div>
            </a>
          ))}
        </div>
      </Section>

      {/* Academies */}
      <Section title="ACADEMIAS DE PREPARACIÓN" icon={<GraduationCap className="w-5 h-5 text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          {academies.map((academy) => (
            <a key={academy.name} href={academy.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className={`bg-black border-2 hover:border-primary transition-colors h-full ${academy.featured ? 'border-primary' : 'border-foreground'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <div className="flex items-center gap-2">{academy.featured && <span className="mono text-xs text-black bg-primary px-2 py-0.5">RECOMENDADO</span>}<ExternalLink className="w-4 h-4 opacity-50" /></div>
                  </div>
                  <CardTitle className="mono text-base mt-2">{academy.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription className="mono text-sm">{academy.description}</CardDescription>
                  <div className="flex flex-wrap gap-1">{academy.specialties.map((spec) => (<span key={spec} className="mono text-xs px-2 py-0.5 bg-foreground/10">{spec}</span>))}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Section>

      {/* Tips */}
      <div className="p-4 border-2 border-foreground">
        <h4 className="mono font-bold mb-3">CONSEJOS PARA OPOSITORES:</h4>
        <ul className="mono text-sm space-y-2 opacity-80">
          <li>• <span className="text-primary">Elige bien:</span> No todas las oposiciones tienen la misma relación esfuerzo/recompensa</li>
          <li>• <span className="text-primary">Planifica:</span> Mínimo 2-5 años de preparación seria para grupos A1/A2</li>
          <li>• <span className="text-primary">Academia vs autodidacta:</span> Las academias ofrecen estructura, pero cuestan 200-400€/mes</li>
          <li>• <span className="text-primary">Compatibiliza:</span> Muchos opositores trabajan mientras preparan</li>
          <li>• <span className="text-primary">Red de apoyo:</span> Grupos de estudio y foros como <a href="https://www.opositores.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">opositores.net</a></li>
        </ul>
      </div>
    </ScrollArea>
  );
};
