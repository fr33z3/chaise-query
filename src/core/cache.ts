import { MutationDocument, QueryDocument } from "./document"
import { Schema } from "./schema"
import { ArrayDataType } from "./schema/array"
import { DTO } from "./schema/dto"

export class ChaiseCache {
  queries: Map<string, any> = new Map()
  dtos: Map<string, any> = new Map()

  writeQuery(document: QueryDocument<any, any>, args: any, data: any) {
    const key = this.getQueryKey(document, args)
    
    const normalizedQueryData = this.normalizeData(document.schema, data)
    this.queries.set(key, normalizedQueryData)
  }

  readQuery(document: QueryDocument<any, any>, args: any) {
    const key = this.getQueryKey(document, args)
    const cache = this.queries.get(key)
    if (!cache) return null

    const queryData = this.denormalizeData(document.schema, cache)

    return queryData
  }

  updateByMutation(document: MutationDocument<any, any>, data: any) {
    this.normalizeData(document.schema, data)
  }

  evictDTO(dto: DTO<any, any>, data: any) {
    const dtoId = dto.getIdentifier(data)
    const dtoRef = this.getDTORef(dto.name, dtoId)
    this.dtos.delete(dtoRef)
  }

  writeDTO(dto: DTO<any, any>, data: any): string {
    const dtoId = dto.getIdentifier(data)
    const dtoRef = this.getDTORef(dto.name, dtoId)
    this.dtos.set(dtoRef, data)

    return dtoRef
  }

  readDTO(dtoRef: string) {
    return this.dtos.get(dtoRef)
  }

  getDTORef(name: string, dtoId: string) {
    return `${name}(${dtoId})`
  }  

  getQueryKey(document: QueryDocument<any, any>, args: Record<string, any> = {}) {
    return `${document.name}:${document.getKeyArgs(args)}`
  }

  private denormalizeData(schema: Schema<any>, data: any) {
    return schema.parse(data, (obj, cachedData: any) => {
      if (obj instanceof DTO) {
        const dtoRef = cachedData.__ref
        const dtoData = this.readDTO(dtoRef) ?? null
        if (dtoData === null) return null

        const denormalizedDTO = obj.parseNext(dtoData, this.denormalizeData.bind(this))
        return denormalizedDTO
      } else if (obj instanceof ArrayDataType) {
        return cachedData.filter(Boolean)
      } else {
        return cachedData
      }
    })
  }

  private normalizeData(schema: Schema<any>, data: any) {
    return schema.parse(data, (obj, objData) => {
      if (obj instanceof DTO) {
        const normalizedDTO = obj.parseNext(objData, this.normalizeData.bind(this))
        const dtoRef = this.writeDTO(obj, normalizedDTO)

        return {
          __ref: dtoRef
        }
      } else {
        return objData
      }      
    })
  }
}