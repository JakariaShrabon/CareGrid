import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NotificationList } from '@/components/layout/notification-center'
import { Container } from '@/components/common/container'
import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/** Full notification feed page, sharing data + list with the topbar popover. */
export function NotificationsPage() {
  return (
    <Container size="fluid" className="max-w-5xl space-y-4 py-6">
      <PageHeader
        title="Notifications"
        description="Priority updates from every care module."
        actions={
          <Button asChild variant="outline">
            <Link to="/app/dashboard">
              <ArrowLeft aria-hidden="true" />
              Back to dashboard
            </Link>
          </Button>
        }
      />
      <Card className="shadow-card">
        <CardContent className="p-0">
          <NotificationList />
        </CardContent>
      </Card>
    </Container>
  )
}