import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    dependencies: DependencyTable
    sources: SourceTable
    sources_dependencies: DependencySourceTable
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
    path_with_namespace: string
    created_at: ColumnType<Date, never, never>
}

export interface DependencySourceTable {
    source_id: string
    dependency_id: number
}

export type DependencySource = Selectable<DependencySourceTable>
export type NewDependencySource = Insertable<DependencySourceTable>
export type DependencySourceUpdate = Updateable<DependencySourceTable>

export type Dependency = Selectable<DependencyTable>
export type NewDependency = Insertable<DependencyTable>
export type DependencyUpdate = Updateable<DependencyTable>

export type Source = Selectable<SourceTable>
export type NewSource = Insertable<SourceTable>
export type SourceUpdate = Updateable<SourceTable>

export interface KartaDependency {
    who: string
    what: string
    value: string
}

export interface SourceDependencies {
    source: Source
    dependencies: Dependency[]
}

export interface RepoFileSchema {
    repoFullName: string,
    repoName: string,
    repoUrl: string,
    repoOwner: string,
    fileName: string,
    filePath: string
}