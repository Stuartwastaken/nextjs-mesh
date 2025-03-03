import AcceptReferral from './components/AcceptReferral';

export default function ReferralDemo() {
  // Sample test data
  const testProps = {
    name: "John Doe",
    userRef: "user123",
    referralHash: "abcdef123456"
  };

  return (
    <AcceptReferral 
      name={testProps.name}
      userRef={testProps.userRef}
      referralHash={testProps.referralHash}
    />
  );
} 