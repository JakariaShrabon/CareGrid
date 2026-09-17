import { useMemo, useState, type ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  PatientStatusBadge,
} from '@/components/clinical/clinical-status-badge'
import type {
  Patient,
  VitalsReading,
} from '@/types/clinical'
import { vitalsLevel } from '@/lib/clinical'
import { userInitials } from '@/lib/utils'

const PAGE_SIZE = 12

type SortKey =
  | 'fullName'
  | 'ward'
  | 'status'
  | 'attendingDoctor'
  | 'admissionDate'

function SortButton({
  column,
  sortKey,
  sortAsc,
  onToggle,
  children,
}: {
  column: SortKey
  sortKey: SortKey
  sortAsc: boolean
  onToggle: (key: SortKey) => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(column)}
      className="inline-flex items-center gap-1 rounded font-medium outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      aria-sort={
        sortKey === column ? (sortAsc ? 'ascending' : 'descending') : 'none'
      }
    >
      {children}
      <span aria-hidden="true" className="text-[10px]">
        {sortKey === column ? (sortAsc ? '▲' : '▼') : '↕'}
      </span>
    </button>
  )
}

interface PatientTableProps {
  patients: Patient[]
  readingsById: ReadonlyMap<string, VitalsReading>
  canRecord: boolean
  onRecordVitals: (patient: Patient) => void
}

/**
 * Patient directory table with sorting, pagination and quick vitals access.
 * Rendering-only role affordances are passed in by the page.
 */
export function PatientTable({
  patients,
  readingsById,
  canRecord,
  onRecordVitals,
}: PatientTableProps) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('admissionDate')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = useMemo(() => {
    const list = [...patients]
    list.sort((a, b) => {
      const value =
        a[sortKey] === b[sortKey]
          ? a.fullName.localeCompare(b.fullName)
          : sortKey === 'admissionDate'
            ? new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime()
            : String(a[sortKey]).localeCompare(String(b[sortKey]))
      return sortAsc ? value : -value
    })
    return list
  }, [patients, sortKey, sortAsc])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const rows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((current) => !current)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No patients found"
        description="Adjust the filters or add a patient to populate the directory."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton column="fullName" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort}>
                  Patient
                </SortButton>
              </TableHead>
              <TableHead>Admission</TableHead>
              <TableHead>
                <SortButton column="ward" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort}>
                  Ward / Bed
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton column="status" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort}>
                  Status
                </SortButton>
              </TableHead>
              <TableHead>Latest vitals</TableHead>
              <TableHead>
                <SortButton column="attendingDoctor" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort}>
                  Attending doctor
                </SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((patient) => {
              const reading = readingsById.get(patient.patientId)
              const flag = reading ? vitalsLevel(reading) : null
              return (
                <TableRow key={patient.patientId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                        aria-hidden="true"
                      >
                        {userInitials(patient.fullName)}
                      </span>
                      <div className="min-w-0">
                        <Link
                          to={`/app/patients/${patient.patientId}`}
                          className="block max-w-[13rem] truncate font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        >
                          {patient.fullName}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {patient.patientId} · {patient.age} yr · {patient.bloodGroup}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(patient.admissionDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {patient.department}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {patient.bed ? patient.bed : 'Unassigned'}
                    </p>
                    <p className="text-xs text-muted-foreground">{patient.ward}</p>
                  </TableCell>
                  <TableCell>
                    <PatientStatusBadge status={patient.status} />
                  </TableCell>
                  <TableCell>
                    {flag && reading ? (
                      <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <span className="tabular-nums">
                          {reading.systolic}/{reading.diastolic}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="tabular-nums">SpO₂ {reading.spo2}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No readings
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="line-clamp-1 max-w-[10rem]">
                      {patient.attendingDoctor}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/app/patients/${patient.patientId}`}>
                          <Stethoscope aria-hidden="true" className="size-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </Button>
                      {canRecord && patient.status !== 'discharged' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRecordVitals(patient)}
                        >
                          <Syringe aria-hidden="true" className="size-3.5" />
                          <span className="hidden sm:inline">Vitals</span>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Button>
          </PaginationItem>
          {Array.from({ length: Math.min(pageCount, 7) }, (_, index) => {
            const pageNumber = index + 1
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === safePage}
                  onClick={() => setPage(pageNumber)}
                  className={cn(pageNumber === safePage ? 'cursor-default' : 'cursor-pointer')}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              disabled={safePage >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-xs text-muted-foreground">
        Showing {rows.length} of {sorted.length} patients
      </p>
    </div>
  )
}