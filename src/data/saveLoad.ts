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

export function downloadPacket(packet: Packet) {
  downloadBlob(new Blob([serializePacket(packet)], { type: 'application/json' }), packetFileName(packet))
}

export async function readPacketFile(file: File): Promise<Packet> {
  let raw: unknown
  try {
    raw = JSON.parse(await file.text())
  } catch {
    throw new PacketFileError("This file couldn't be read. Make sure you picked a packet save file (it ends in .json).")
  }
  return loadPacket(raw)
}
