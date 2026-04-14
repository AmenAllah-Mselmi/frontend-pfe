
import Image from 'next/image'

const EmailDemoSection = () => {
  return (
    <div className="flex items-center justify-center gap-10 p-10 bg-gray-100   flex-wrap md:flex-nowrap">
      <Image 
        src="/Gif/Writemyemail.gif"
        className=' w-1/2 '
        alt="Email Demo"
        width={400} 
        height={300}
      />
      
      <div className='flex flex-col   w-1/2 gap-6 '>
        <h1 className='text-3xl font-bold'>
          Faites connaissance avec Pipedrive IA
        </h1>
        <p>Boostez votre succès avec commercial au moyen de nos fonctionnalités IA. Eliminez les processus manuels, rationalisez votre communication et prenez des decisions etayés par les données pour vendre plus vite et plus intelligemment. </p>
        <button className='text-white bg-indigo-600 h-10 w-36 rounded-l-xs'>En savoir plus</button>
      </div>
    </div >
  )
}

export default EmailDemoSection