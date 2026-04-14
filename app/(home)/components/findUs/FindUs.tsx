const LocationSection = () => {
    return (
     <div className="mx-auto w-11/12 border-none">
         <section className="py-8 md:py-12">
        <div className="mx-auto">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:mb-7 lg:text-start lg:text-5xl lg:font-extrabold lg:leading-none">
            Find us here.
          </h1>
          <iframe
            title="tsyp location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12941.701626024917!2d10.642093!3d35.814037!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302756a7452317b%3A0xfe8bdcb107b21c72!2sInstitut%20Sup%C3%A9rieur%20des%20Sciences%20Appliqu%C3%A9es%20et%20de%20Technologie%20de%20Sousse!5e0!3m2!1sfr!2stn!4v1726792840117!5m2!1sfr!2stn"
            className="w-full rounded-2xl shadow-md"
            height="500"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: '0px' }}
          ></iframe>
        </div>
      </section>
     </div>
    );
  };
  export default LocationSection;
  