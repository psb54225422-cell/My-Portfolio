type QueryResult<T> = Promise<{ data: T; error: null }>

function createResolvedResult<T>(data: T): QueryResult<T> {
  return Promise.resolve({ data, error: null })
}

function createQueryBuilder() {
  const result = createResolvedResult<null>(null)

  const builder: any = {
    select() {
      return builder
    },
    single() {
      return result
    },
    maybeSingle() {
      return result
    },
    eq() {
      return builder
    },
    in() {
      return builder
    },
    order() {
      return builder
    },
    insert() {
      return builder
    },
    update() {
      return builder
    },
    upsert() {
      return builder
    },
    delete() {
      return builder
    },
    then: result.then.bind(result),
    catch: result.catch.bind(result),
    finally: result.finally.bind(result),
  }

  return builder
}

export function createFallbackSupabaseClient() {
  return {
    from() {
      return createQueryBuilder()
    },
  }
}
