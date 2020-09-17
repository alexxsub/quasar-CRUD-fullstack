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
export const MODIFY_PHONE = gql`
  mutation($input: inputPhone!) {
    modifyPhone(input: $input) {
      ...Phone
    }
  }
  ${fragment}
`
export const DELETE_PHONE = gql`
  mutation($id: ID!) {
    deletePhone(id: $id) {
    ...Phone
    }
  }
  ${fragment}
`
export const PHONE_ADDED_SUBSCRIPTION = gql`
  subscription {
    addedPhone {
      ...Phone
    }
  }
  ${fragment}
  `
export const PHONE_UPDATED_SUBSCRIPTION = gql`
  subscription {
    updatedPhone {
      ...Phone
    }
  }
  ${fragment}
  `
export const PHONE_DELETED_SUBSCRIPTION = gql`
subscription {
  deletedPhone {
    ...Phone
  }
}
${fragment}
`
