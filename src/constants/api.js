export const PUBLIC_API_URL = process.env.REACT_APP_PUBLIC_API_URL
export const PUBLIC_API_KEY = process.env.REACT_APP_PUBLIC_API_KEY + '$' + process.env.REACT_APP_PUBLIC_API_KEY_SECOND_PART

export const apiPaths = {
    getArticle : '/api/articles/article',
    getProfile: '/api/profile/get-profile'
}