import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, HeartPulse } from 'lucide-react'
import { Container } from '@/components/common/container'
import { ErrorState } from '@/components/common/error-state'
import { LoadingState } from '@/components/common/loading-state'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { VitalsChart, VitalsLevelBadge } from '@/components/clinical'
import { patientService, vitalsService } from '@/services'
import {
  VITALS_DISCLAIMER,
  vitalsLevel,
} from '@/lib/clinical'
import { userInitials } from '@/lib/utils'

const chartStroke = 'var(--color-chart-1)'
const chartStrokeSecondary = 'var(--color-chart-2)'
const chartStrokeTertiary = 'var(--color-chart-3)'
const chartStrokeFourth = 'var(--color-chart-4)'

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-2">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

/** Per-patient vitals history: four charted metrics + recent care events. */
export function VitalsHistoryPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const id = patientId ?? ''

  const { data: patient, isLoading: patientLoading, isError: patientError, refetch } = useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientService.get(id),
    enabled: Boolean(id),
  })
  const { data: latest } = useQuery({
    queryKey: ['vitals', 'single', id],
    queryFn: () => vitalsService.getReading(id),
    enabled: Boolean(id),
  })
  const { data: history } = useQuery({
    queryKey: ['vitals', 'history', id],
    queryFn: () => vitalsService.historyFor(id),
    enabled: Boolean(id),
  })

  if (patientLoading) {
    return (
      <Container size="fluid" className="max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
        <LoadingState rows={8} />
      </Container>
    )
  }

  if (patientError || !patient) {
    return (
      <Container size="fluid" className="max-w-[90rem] space-y-6 py-6">
        <ErrorState
          title="Patient not found"
          description="The vitals record for this patient is unavailable."
          onRetry={() => refetch()}
          actions={
            <Button asChild variant="outline">
              <Link to="/app/vitals">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back to vitals
              </Link>
            </Button>
          }
        />
      </Container>
    )
  }

  const flag = latest ? vitalsLevel(latest) : null
  const chartData = history ?? []

  return (
    <Container size="fluid" className="max-w-[90rem] space-y-6 py-6">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to="/app/vitals">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Vitals
        </Link>
      </Button>

      <PageHeader
        title="Vitals history"
        description={`${patient.fullName} · ${patient.patientId} · last 7 days`}
        actions={
          <>
            <span
              className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              aria-hidden="true"
            >
              {userInitials(patient.fullName)}
            </span>
            {flag ? <VitalsLevelBadge level={flag.level} label={flag.label} /> : null}
            <Button asChild variant="outline">
              <Link to={`/app/patients/${patient.patientId}`}>
                <HeartPulse aria-hidden="true" className="size-4" />
                Patient record
              </Link>
            </Button>
          </>
        }
      />

      <p className="text-xs text-muted-foreground">{VITALS_DISCLAIMER}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Heart rate" description="Beats per minute over time">
          {chartData.length ? (
            <VitalsChart
              data={chartData}
              metric="heartRate"
              unit="bpm"
              color={chartStroke}
              refLines={[60, 100]}
            />
          ) : (
            <NoHistory />
          )}
        </ChartCard>
        <ChartCard title="Blood pressure" description="Systolic and diastolic (mmHg)">
          {chartData.length ? (
            <div className="space-y-3">
              <VitalsChart
                data={chartData}
                metric="systolic"
                unit="mmHg"
                color={chartStrokeSecondary}
                refLines={[120]}
              />
              <VitalsChart
                data={chartData}
                metric="diastolic"
                unit="mmHg"
                color={chartStrokeTertiary}
                refLines={[80]}
              />
            </div>
          ) : (
            <NoHistory />
          )}
        </ChartCard>
        <ChartCard title="Temperature" description="Core temperature (°C)">
          {chartData.length ? (
            <VitalsChart
              data={chartData}
              metric="temperature"
              unit="°C"
              color={chartStrokeFourth}
              domain={[34, 42]}
              refLines={[37]}
            />
          ) : (
            <NoHistory />
          )}
        </ChartCard>
        <ChartCard title="SpO₂" description="Oxygen saturation (%)">
          {chartData.length ? (
            <VitalsChart
              data={chartData}
              metric="spo2"
              unit="%"
              color={chartStrokeTertiary}
              domain={[80, 100]}
              refLines={[95]}
            />
          ) : (
            <NoHistory />
          )}
        </ChartCard>
      </div>
    </Container>
  )
}

function NoHistory() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
      <p className="text-sm text-muted-foreground">No history available yet.</p>
    </div>
  )
}