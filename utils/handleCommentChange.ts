/**
 * Handles changing the content of a comment
 * @param pinId ID of the pin to change comment
 * @param value New comment value
 * @param setComments Function to update comments state
 */
export const handleCommentChange = (
    pinId: string, 
    value: string,
    setComments: (comments: { [key: string]: string } | ((prev: { [key: string]: string }) => { [key: string]: string })) => void
) => {
    setComments(prev => ({ ...prev, [pinId]: value }));
};
