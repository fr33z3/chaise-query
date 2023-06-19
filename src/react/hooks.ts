import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ClientContext } from './ClientProvider'
import { MutationDocument, QueryDocument } from '../core/document'
import { ObservableQuery, ObservableState, QueryOptions } from '../core/observable_query'
import { ObjectDataType } from '../core/schema/object'
import { InferType } from '../core/schema/base'
import { MutationOptions, MutationResponse } from '../core/client'
import { ChaiseCache } from '../core/cache'

export function useClient() {
  const client = useContext(ClientContext)
  if (!client) throw new Error('Wrap your app in a <ChaiseProvider>')

  return client
}

type QueryHookOptions<Input extends ObjectDataType<any>> = Partial<Omit<QueryOptions<Input>, 'args'>> & Pick<QueryOptions<Input>, 'args'>
type QueryHookReturn<TData> = ObservableState<TData> & {
  refetch: () => Promise<void>
}

export function useQuery<TData, TArgs extends ObjectDataType<any>>(document: QueryDocument<TData, TArgs>, options: QueryHookOptions<TArgs>): QueryHookReturn<TData> {
  const client = useClient()
  const [state, setState] = useState<ObservableState<TData>>({
    data: null,
    error: null,
    loading: false,
  })

  const opts: QueryOptions<TArgs> = useMemo(() => {
    return {
      cachePolicy: 'cache-and-network',
      ...options,
    }
  }, [options])

  const observableQueryRef = useRef<ObservableQuery<TData, TArgs> | null>(null)
  
  useEffect(() => {
    observableQueryRef.current = client.getObservableQuery(document, opts)    
    const observer = observableQueryRef.current.subscribe({ next: setState })
    observableQueryRef.current.fetch()
    
    return () => {
      observer.unsubscribe()
    }
  }, [JSON.stringify(options)])

  async function refetch() {
    if (observableQueryRef.current) {
      observableQueryRef.current.refetch()
    }
  }

  return { ...state, refetch }
}

type MutationHookOptions<TData, TArgs extends ObjectDataType<any>> = Partial<Omit<MutationOptions<TData, TArgs>, 'args'>>

type MutationHookReturn<TData, TArgs extends ObjectDataType<any>> = [
  (args: InferType<TArgs>) => Promise<MutationResponse<TData>>,
  {
    loading: boolean
  }
]

export function useMutation<TData, TArgs extends ObjectDataType<any>>(mutation: MutationDocument<TData, TArgs>, options?: MutationHookOptions<TData, TArgs>): MutationHookReturn<TData, TArgs> {
  const client = useClient()
  const [loading, setLoading] = useState(false)

  async function mutate(args: InferType<TArgs>) {
    setLoading(true)
    const response = client.mutate(mutation, {
      args,
      cachePolicy: 'cache',
      ...(options ?? {}),
    })
    setLoading(false)

    return response
  }

  return [mutate, { loading }]
}

export function useCache(): ChaiseCache {
  const client = useClient()
  return client.cache
}