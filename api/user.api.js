const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const fetchUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/users/${userId}/profile`);

    if (!response.ok) {
      throw new Error('fetching data is failed');
    }

    const profile = response.json();
    return profile;
  } catch (error) {
    console.error(error);
  }
};

export const fetchUserBlockItems = async (userId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/users/${userId}/blockItems`);

    if (!response.ok) {
      throw new Error('fetching data is failed');
    }

    const blockItems = response.json();
    return blockItems;
  } catch (error) {
    console.error(error);
  }
};
