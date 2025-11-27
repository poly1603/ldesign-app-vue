/**
 * 用户 API 服务
 *
 * 提供用户相关的 API 接口
 */
import httpClient from './http'

/**
 * 用户数据接口
 */
export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

/**
 * 文章数据接口
 */
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

/**
 * 评论数据接口
 */
export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

/**
 * 用户 API 服务类
 */
export class UserService {
  /**
   * 获取所有用户
   */
  static async getUsers() {
    const response = await httpClient.get<User[]>('/users')
    return response.data
  }

  /**
   * 根据 ID 获取用户
   */
  static async getUserById(id: number) {
    const response = await httpClient.get<User>(`/users/${id}`)
    return response.data
  }

  /**
   * 创建用户
   */
  static async createUser(user: Partial<User>) {
    const response = await httpClient.post<User>('/users', user)
    return response.data
  }

  /**
   * 更新用户
   */
  static async updateUser(id: number, user: Partial<User>) {
    const response = await httpClient.put<User>(`/users/${id}`, user)
    return response.data
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: number) {
    await httpClient.delete(`/users/${id}`)
  }

  /**
   * 获取用户的文章
   */
  static async getUserPosts(userId: number) {
    const response = await httpClient.get<Post[]>(`/users/${userId}/posts`)
    return response.data
  }
}

/**
 * 文章 API 服务类
 */
export class PostService {
  /**
   * 获取所有文章
   */
  static async getPosts(params?: { _page?: number, _limit?: number }) {
    const response = await httpClient.get<Post[]>('/posts', { params })
    return response.data
  }

  /**
   * 根据 ID 获取文章
   */
  static async getPostById(id: number) {
    const response = await httpClient.get<Post>(`/posts/${id}`)
    return response.data
  }

  /**
   * 获取文章的评论
   */
  static async getPostComments(postId: number) {
    const response = await httpClient.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  }

  /**
   * 创建文章
   */
  static async createPost(post: Partial<Post>) {
    const response = await httpClient.post<Post>('/posts', post)
    return response.data
  }
}
