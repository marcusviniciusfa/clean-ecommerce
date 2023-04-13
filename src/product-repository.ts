export interface ProductRepository {
  findById(id: number): Promise<any>
}
