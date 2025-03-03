import { useRouter } from 'next/router';
import AcceptReferral from './components/AcceptReferral';

export default function AcceptReferralPage() {
  const router = useRouter();
  const { name, userRef, referralHash } = router.query;

  // Only render the component when we have all required props
  if (!name || !userRef || !referralHash) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#3498db' }}>Missing Information</h2>
          <p>This referral link is incomplete. Please make sure you have a valid referral link.</p>
        </div>
      </div>
    );
  }

  return (
    <AcceptReferral 
      name={Array.isArray(name) ? name[0] : name}
      userRef={Array.isArray(userRef) ? userRef[0] : userRef}
      referralHash={Array.isArray(referralHash) ? referralHash[0] : referralHash}
    />
  );
} 