import '@tanstack/react-table'

namespace NodeJS {
   interface ProcessEnv {
      SECRET: string
      SUPABASE_URL: string
      SUPABASE_KEY: string
   }
}

declare module '@tanstack/react-table' {
   interface ColumnMeta<TData extends RowData, TValue> {
      className: string
   }
}
