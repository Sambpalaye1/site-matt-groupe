import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export type AttestationData = {
  souscripteur: string;
  telephone: string;
  marque: string;
  modele: string;
  immatriculation: string;
  premiereCirculation: string;
  categorie: string;
  puissanceFiscale: string;
  nombrePlaces: number;
  formule: string;
  dureeMois: number;
  dateDebut: Date;
  dateFin: Date;
  prime: number;
  policeNumero: string;
  attestationNumero: string;
  cleSecurite: string;
};

const PROVIDENCE_YELLOW = "#F5C518";
const PROVIDENCE_PURPLE = "#5A1A6B";

export async function generateAttestationPDF(data: AttestationData): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;

  // Header band
  doc.setFillColor(PROVIDENCE_YELLOW);
  doc.rect(0, 0, W, 38, "F");
  doc.setFillColor(PROVIDENCE_PURPLE);
  doc.rect(0, 38, W, 4, "F");

  // Providence logo block (text-based since we render dynamically)
  doc.setTextColor(PROVIDENCE_PURPLE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ASSURANCES", 14, 16);
  doc.setFontSize(20);
  doc.text("LA PROVIDENCE", 14, 25);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Partenaire officiel Matt Group Sénégal", 14, 31);

  // FSSA badge
  doc.setDrawColor(PROVIDENCE_PURPLE);
  doc.setTextColor(PROVIDENCE_PURPLE);
  doc.setFontSize(7);
  doc.text("FSSA · Sécurité · Disponibilité · Proximité", W - 14, 16, { align: "right" });

  // Title
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ATTESTATION D'ASSURANCE AUTOMOBILE", W / 2, 54, { align: "center" });

  // Top info row
  doc.setDrawColor(220);
  doc.line(14, 60, W - 14, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110);
  doc.text("N° IMM", 18, 67);
  doc.text("GENRE", 80, 67);
  doc.text("MARQUE", 140, 67);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text(data.immatriculation || "—", 18, 74);
  doc.text(data.categorie.toUpperCase(), 80, 74);
  doc.text(data.marque.toUpperCase(), 140, 74);
  doc.line(14, 80, W - 14, 80);

  // Souscripteur
  let y = 92;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110);
  doc.text("SOUSCRIPTEUR", 18, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text(data.souscripteur.toUpperCase(), 18, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("Téléphone", 110, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(data.telephone, 110, y + 7);

  // Véhicule
  y = 112;
  doc.setDrawColor(230);
  doc.roundedRect(14, y, W - 28, 60, 2, 2);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(PROVIDENCE_PURPLE);
  doc.text("VÉHICULE & POLICE", 18, y + 7);

  const rows: [string, string][] = [
    ["Modèle", data.modele],
    ["Police N°", data.policeNumero],
    ["Valable du", `${fmt(data.dateDebut)} au ${fmt(data.dateFin)} à 23:59`],
    ["N° attestation", data.attestationNumero],
    ["Catégorie", data.categorie],
    ["Nombre de places", String(data.nombrePlaces)],
    ["Puissance fiscale", `${data.puissanceFiscale} CV`],
    ["Formule", data.formule],
    ["Prime acquittée", new Intl.NumberFormat("fr-FR").format(data.prime) + " FCFA"],
  ];
  doc.setFontSize(9);
  let ry = y + 14;
  rows.forEach((r, i) => {
    const col = i % 2;
    const line = Math.floor(i / 2);
    const x = 18 + col * 90;
    const ly = ry + line * 9;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110);
    doc.text(r[0] + " :", x, ly);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20);
    doc.text(r[1], x + 38, ly);
  });

  // QR code
  const qrData = `https://providence.sn/verify/${data.attestationNumero}|${data.cleSecurite}`;
  const qrDataUrl = await QRCode.toDataURL(qrData, { margin: 0, width: 220 });
  doc.addImage(qrDataUrl, "PNG", W - 50, 186, 34, 34);
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text("Scannez pour vérifier", W - 50, 224);

  // Bottom strip
  doc.setFillColor(PROVIDENCE_PURPLE);
  doc.rect(0, 250, W, 12, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ATTESTATION D'ASSURANCE — LA PROVIDENCE", W / 2, 258, { align: "center" });

  doc.setTextColor(40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Police: ${data.policeNumero}`, 14, 270);
  doc.text(`Attestation: ${data.attestationNumero}`, 14, 275);
  doc.text(`N° d'imm: ${data.immatriculation}`, 14, 280);
  doc.text(`Expire le: ${fmt(data.dateFin)} à 23:59`, 14, 285);
  doc.text(`Clé de sécurité: ${data.cleSecurite}`, 14, 290);

  return doc.output("blob");
}

function fmt(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function genPoliceNumero() {
  return `LPV-${Math.floor(10000 + Math.random() * 90000)}-${randHex(8).toUpperCase()}-1-E`;
}
export function genAttestationNumero() {
  return "SN" + randAlphaNum(9).toUpperCase();
}
export function genCleSecurite() {
  return Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join("");
}
function randHex(n: number) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}
function randAlphaNum(n: number) {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join("");
}
