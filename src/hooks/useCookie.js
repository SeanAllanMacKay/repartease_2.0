import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default cookies.get('game')

export const set = (newCookie) => {
    cookies.set('game', JSON.stringify(newCookie), { path: '/' })
}

export const remove = () => {
    cookies.remove('game', { path: '/' })
}