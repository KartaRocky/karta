import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    dependency: DependencyTable
    source: SourceTable
}

export interface DependencyTable {
    id: Generated<number>
    who: string
    what: string
    value: string
    created_at: ColumnType<Date, never, never>
}

export interface SourceTable {
    url: string
    repository_name: string
    repository_owner: string
    created_at: ColumnType<Date, never, never>
}

export type Dependency = Selectable<DependencyTable>
export type NewDependency = Insertable<DependencyTable>
export type DependencyUpdate = Updateable<DependencyTable>

export type Source = Selectable<SourceTable>
export type NewSource = Insertable<SourceTable>
export type SourceUpdate = Updateable<SourceTable>