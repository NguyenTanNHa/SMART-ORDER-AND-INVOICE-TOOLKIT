const API_BASE_URL = "http://localhost:5000/api";

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerEmail?: string;
  phone?: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export async function createOrder(order: Order): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }
}

export async function getOrders(searchQuery: string = ""): Promise<Order[]> {
  const url = searchQuery
    ? `${API_BASE_URL}/orders?search=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/orders`;
    
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}
