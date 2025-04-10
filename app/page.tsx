export const revalidate = 0;


import HomeBanner from '@/components/Navbar/HomeBanner'
import Container from '@/components/universal/Container'
import ProductCard from '@/components/Products/ProductCard';
import getProducts, { IProductParams } from '@/actions/getProduct';
import NullData from '@/components/NullData';

interface HomeProps{
  searchParams : IProductParams
}

export default async function Home({searchParams}:HomeProps) {

  const products = await getProducts(searchParams)

  if (products.length === 0) {
    return <NullData title='No Products Found. Click "All" to clear filters'/>
  }

  function shuffleArray(array:any){
    for (let i = array.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [array[i] , array[j]] = [array[j] , array[i]] 
      
    }

    return array
  }


  const shuffleProducts = shuffleArray(products)
  return (
    <div className=' p-8'>
      <Container>
        <div>
          <HomeBanner/>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  m-4 mt-8 gap-8 '>
          {shuffleProducts.map((product:any)=>{
            return <ProductCard data={product} key={product.id}></ProductCard>;
          })}
        </div>
      </Container>
    </div>
  )
}
