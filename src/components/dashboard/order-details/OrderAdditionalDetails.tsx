interface OrderAdditionalDetailsProps {
  details: string | null;
}

export const OrderAdditionalDetails = ({ details }: OrderAdditionalDetailsProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Additional Details</h3>
      <p className="whitespace-pre-wrap">{details || 'No additional details provided.'}</p>
    </div>
  );
};