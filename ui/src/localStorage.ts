import normalizer from 'src/normalizers/dashboardTime'
import {VERSION} from 'src/shared/constants'
import {
  newVersion,
  loadLocalSettingsFailed,
} from 'src/shared/copy/notifications'

import {LocalStorage} from 'src/types/localStorage'

export const loadLocalStorage = (): LocalStorage => {
  try {
    const serializedState = localStorage.getItem('state')

    const state = JSON.parse(serializedState) || {}

    if (state.VERSION && state.VERSION !== VERSION) {
      const version = VERSION ? ` (${VERSION})` : ''

      console.log(newVersion(version).message) // eslint-disable-line no-console
    }

    delete state.VERSION

    return state
  } catch (error) {
    console.error(loadLocalSettingsFailed(error).message)
  }
}

export const saveToLocalStorage = ({
  app: {persisted},
  ranges,
  variables,
}: LocalStorage): void => {
  try {
    const appPersisted = {app: {persisted}}
    window.localStorage.setItem(
      'state',
      JSON.stringify({
        ...appPersisted,
        VERSION,
        ranges: normalizer(ranges),
        variables,
      })
    )
  } catch (err) {
    console.error('Unable to save data explorer: ', JSON.parse(err))
  }
}
