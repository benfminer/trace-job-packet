// One icon per packet page, used on Home and in page headers.
import {
  Bus, CalendarDays, ClipboardList, FileText, FolderOpen, HeartHandshake, ListChecks, Mail, MessageSquare, Mic,
  User, Users, Wallet, type LucideIcon,
} from 'lucide-react'
import type { PageId } from '../data/packet'

export const PAGE_ICONS: Record<PageId, LucideIcon> = {
  about: User,
  resume: FileText,
  coverLetter: Mail,
  appInfo: ClipboardList,
  references: Users,
  availability: CalendarDays,
  documents: FolderOpen,
  disclosure: MessageSquare,
  transportation: Bus,
  supportTeam: HeartHandshake,
  benefits: Wallet,
  interview: Mic,
  tracker: ListChecks,
}
