// Save = download a .json file. Open = read one back. Nothing is stored by the app itself.
import { loadPacket, PacketFileError, type Packet } from './packet'

export function packetFileName(packet: Packet) {
  const name = [packet.profile.firstName, packet.profile.lastName]
    .map((s) => s.trim().replace(/[^A-Za-z0-9-]+/g, '_'))
    .filter(Boolean)
    .join('_')
  return `${name || 'Student'}_packet.json`
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function serializePacket(packet: Packet) {
  return JSON.stringify({ ...packet, savedAt: new Date().toISOString() }, null, 2)
}

type SaveFilePicker = (options: {
  suggestedName: string
  types: { description: string; accept: Record<string, string[]> }[]
}) => Promise<FileSystemFileHandle>

const FILE_TYPES = {
  packet: { description: 'Packet save file', accept: { 'application/json': ['.json'] } },
  word: { description: 'Word document', accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } },
}

// Chrome and Edge open a "Save As" window so staff can pick the folder (like a Google Drive folder).
// Other browsers download to the Downloads folder. Returns false if the window was cancelled.
// The window has to open right after the click, so the file is made after it opens.
export async function saveFile(fileName: string, kind: keyof typeof FILE_TYPES, makeBlob: () => Blob | Promise<Blob>) {
  const pick = (window as { showSaveFilePicker?: SaveFilePicker }).showSaveFilePicker
  if (!pick) {
    downloadBlob(await makeBlob(), fileName)
    return true
  }
  let file: FileSystemFileHandle
  try {
    file = await pick({ suggestedName: fileName, types: [FILE_TYPES[kind]] })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return false
    // The window couldn't open (blocked or not allowed here), so download it the usual way.
    downloadBlob(await makeBlob(), fileName)
    return true
  }
  const out = await file.createWritable()
  await out.write(await makeBlob())
  await out.close()
  return true
}

export const savePacket = (packet: Packet) =>
  saveFile(packetFileName(packet), 'packet', () => new Blob([serializePacket(packet)], { type: 'application/json' }))
export async function readPacketFile(file: File): Promise<Packet> {
  let raw: unknown
  try {
    raw = JSON.parse(await file.text())
  } catch {
    throw new PacketFileError("This file couldn't be read. Make sure you picked a packet save file (it ends in .json).")
  }
  return loadPacket(raw)
}
