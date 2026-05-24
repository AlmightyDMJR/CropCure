import { getDiagnosis } from '@/lib/insforge'
import ResultsClient from '@/components/ResultsClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params

  let diagnosis = null
  let fetchError = false

  try {
    diagnosis = await getDiagnosis(id)
  } catch {
    fetchError = true
  }

  return <ResultsClient diagnosis={diagnosis} fetchError={fetchError} id={id} />
}
