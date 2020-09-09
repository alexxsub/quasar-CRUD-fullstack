import gql from 'graphql-tag'
// для компактности выделяем фрагмент gql,
// его мы будем часто использовать. Этот фрагмент наша структура таблицы
export const fragment = gql`
  fragment Phone on Phone {
    id
    phone
    name
    address
  }
`
// теперь опишем наш основной запрос, константы потом проще использовать в коде
// получаем все записи телефонов
// переопределенный фрагмент - это формат вывода данных, описываем как ...Phone
// аналогично запрос можно описать так
// const ALL_PHONES_QUERY = gql`
//   query Phones {
//     Phones {
//       id
//       number
//       name
//     }
//   }
// `;

export const ALL_PHONES_QUERY = gql`
  query Phones {
    Phones {
      ...Phone
    }
  }
  ${fragment}
`
// Описываем запрос на добавление в формате GraphQL
export const ADD_PHONE_MUTATION = gql`
  mutation($input: inputPhone!) {
    addPhoneByInput(input: $input) {
      ...Phone
    }
  }
  ${fragment}
`
export const DELETE_PHONE_MUTATION = gql`
  mutation($id: ID!) {
    deletePhoneByID(id: $id)
  }
`

export const UPDATE_PHONE_MUTATION = gql`
  mutation($id: ID!, $input: inputPhone!) {
    updatePhoneByID(id: $id, input: $input) {
      ...Phone
    }
  }
  ${fragment}
`
