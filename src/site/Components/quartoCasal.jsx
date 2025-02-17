function QuartoCasal() { 
    return <section id="hospedagem">
        <div className="container">
            <div className="row">

                <div className="col-lg-7">
                    <div  className="carousel slide" data-bs-ride="carousel" id="carousel1"> 
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                            <img src="Images\suite.jpg" className="d-block w-100" alt="bla"></img>
                            </div>
                            <div className="carousel-item">
                            <img src="Images\externa.jpg" className="d-block w-100" alt="blabla"></img>
                            </div>
                            <div className="carousel-item">
                            <img src="Images\hidro.jpg" className="d-block w-100" alt="blablabla"></img>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="col-lg-5">
                    <h2> Suite de casal </h2> 
                    <p></p> 
                    <li>Hidromassagem</li>
                    <li>Frigobar</li>
                    <li>Iluminação ambiente</li>
                    <li>Rede na varanda</li>
                    <li>Ventilador de teto </li>
                    
                                            
                </div>

                
            </div>
        </div>
    </section>
}

export default QuartoCasal