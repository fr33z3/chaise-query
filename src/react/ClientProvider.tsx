import { FC, ReactNode, createContext } from 'react'
import { ChaiseClient } from '../core/client'

export const ClientContext = createContext<ChaiseClient | null>(null)

interface ChaiseProviderProps {
  client: ChaiseClient
  children: ReactNode
}

export const ChaiseProvider: FC<ChaiseProviderProps> = ({ client, children }) => {
  return (
    <ClientContext.Provider value={client}>
      {children}
    </ClientContext.Provider>
  )
}