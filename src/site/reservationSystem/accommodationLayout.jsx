import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DOMPurify from 'dompurify';
import MediaSlide from '../../components/MediaSlide';
import ErrorBoundary from '../../components/ErrorBoundary';
import { SharedContext } from '../../Context/SharedContextProvider';
import { ClientContext } from '../../Context/ClientContextProvider';

const AccommodationLayout = () => {
  const { accommodations, error: sharedError } = useContext(SharedContext);
  const { fetchReservations } = useContext(ClientContext); // If client-specific functionality is needed
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sharedError) {
      setError(sharedError);
      setLoading(false);
    } else if (accommodations) {
      const initialSelectedItems = accommodations.reduce((acc, accommodation) => {
        acc[accommodation.id] = 0;
        return acc;
      }, {});
      setSelectedItems(initialSelectedItems);
      setLoading(false);
    }
  }, [accommodations, sharedError]);

  const renderThumbs = useMemo(() => (files) => {
    if (!files || files.length === 0) return [];
    return files.map((fileObj, index) => (
      <MediaSlide key={index} fileObj={fileObj} isSelected={false} />
    ));
  }, []);

  if (loading) {
    return <p>Loading accommodations...</p>;
  }

  return (
    <ErrorBoundary>
      {error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="hospedagem-page container-fluid">
          {accommodations.map(({ id, nome, descricao, files, preco, disponibilidade }) => (
            <section id="hospedagem" key={id}>
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-12 col-md-6 hospedagem-column-left">
                    <Carousel
                      renderThumbs={() => renderThumbs(files)}
                      thumbWidth={160}
                      infiniteLoop
                      selectedItem={selectedItems[id]}
                      onChange={(index) =>
                        setSelectedItems((prev) => ({ ...prev, [id]: index }))
                      }
                    >
                      {files?.map((fileObj, index) => (
                        <MediaSlide key={index} fileObj={fileObj} isSelected={index === selectedItems[id]} />
                      ))}
                    </Carousel>
                  </div>
                  <div className="col-12 col-md-6 hospedagem-column-right">
                    <h1>{nome}</h1>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descricao) }} />
                    <p>Preço: {preco}</p>
                    <p>Disponibilidade: {disponibilidade ? 'Disponível' : 'Indisponível'}</p>
                    <button disabled={!disponibilidade}>Reservar</button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default AccommodationLayout;
