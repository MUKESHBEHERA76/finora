import './Loans.css';
import { useState } from 'react';
import RegisterLoanModal from './RegisterLoanModal';

function Loans() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <header className="loans-header">
  <p>Home / Payments / Loans</p>
</header>

<button className="register-loan-btn" onClick={openModal}>
  Register Loan
</button>

{isModalOpen && <RegisterLoanModal onClose={closeModal} />}

    </>
  );
}

export default Loans;
