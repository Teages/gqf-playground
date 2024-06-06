import { useSchema } from '@teages/gqf'
import { GraphQLClient } from 'graphql-request'

/**
 * GraphQL endpoint
 * 
 * We use Anilist as an example here.
 * Notice it has usage limit so don't sending too many requests at once.
 * You can replace it with your own endpoint.
 * 
 * Don't forget to add your schema after replace to your own endpoint.
 * ```bash
 * pnpm gqf add <your-endpoint-url>
 * ```
 */
const endpoint = 'https://graphql.anilist.co'

const { gqf, gqp, $enum } = useSchema(endpoint)
const client = new GraphQLClient(endpoint)

const query = gqf('query FetchAnime', {
  id: 'Int = 127549',
}, [{
  Media: $ => $({ id: $.id, type: $enum('ANIME') }, [
    'id',
    {
      title: $ => $([
        'romaji',
        'english',
        'native',
      ]),
    },
  ]),
}])

const data = await client.request(query, {
  id: 127549,
})

// Output:
// {
//   "Media": {
//     "id": 127549,
//     "title": {
//       "romaji": "Slow Loop",
//       "english": "Slow Loop",
//       "native": "スローループ"
//     }
//   }
// }

console.log(JSON.stringify(data, null, 2))
