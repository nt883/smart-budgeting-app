import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <form onSubmit={handleSubmit} style={{ width: '320px' }}>
        <h2>Reset password</h2>
        {submitted ? (
          <p>If that email exists, a reset link has been sent.</p>
        ) : (
          <>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Send reset link</button>
          </>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;