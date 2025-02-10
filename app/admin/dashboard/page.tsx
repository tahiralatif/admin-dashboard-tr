"use client";

import ProtectedRoutpage from "@/app/components/ProtectedRoute";
import { client } from "@/sanity/lib/client";
import React from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Order {
  _id: string;
  _type: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: number;
  email: string;
  country: string;
  payment: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartitems: { title: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<Order | string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    client
      .fetch(
        `
        *[_type == "order"]{
            _id,
            firstName,
            lastName,
            address,
            city,
            state,
            zip,
            phone,
            email,
            country,
            payment,
            total,
            discount,
            orderDate,
            status,
            cartitems[] {
                title,
                image
            }
        }`
      )
      .then((data) => setOrders(data))
      .catch(() => console.log("error fetching orders")); // Removed unused `error` variable
  }, []);

  const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error); // `error` is used here
      Swal.fire("Error!", "Failed to delete order", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Status updated!", "Order status has been updated.", "success");
      if (newStatus === "dispatched") {
        Swal.fire("Success!", "Order dispatched successfully", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success!", "Order Completed successfully", "success");
      } else if (newStatus === "cancelled") {
        Swal.fire("Success!", "Order Cancelled successfully", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error); // `error` is used here
      Swal.fire("Error!", "Failed to update order status", "error");
    }
  };

  return (
    <>
      <ProtectedRoutpage>
        <div className="flex flex-col h-screen bg-gray-100">
          <nav className="bg-teal-800 p-4 text-white shadow-lg flex justify-between">
            <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
            <div className="flex space-x-4">
              {["All", "Pending", "success", "dispatched", "Cancelled", "Log Out"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 hover:bg-teal-900 hover:text-white focus:outline-none
                            ${filter === status ? "bg-teal-600 text-white font-bold" : "bg-white text-teal-800"}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div></div>
          </nav>
          <div className="flex-1 p-6 overflow-y-auto flex-col flex-grow">
            <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
            <div className="overflow-y-auto bg-white rounded-lg shadow-sm">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="cursor-pointer hover:bg-gray-100 transition-all" onClick={() => toggleOrderDetails(order._id)}>
                        <td>{order._id}</td>
                        <td>{order.firstName} {order.lastName}</td>
                        <td>{order.address}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{order.total}</td>
                        <td>
                          <select
                            value={order.status || ""}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="success">Success</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order._id);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {selectedOrderId === order._id && (
                        <tr>
                          <td colSpan={7} className="bg-gray-50 p-4 transition-all animation-fade-in">
                            <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                            <p>Phone: <strong>{order.phone}</strong></p>
                            <p>Email: <strong>{order.email}</strong></p>
                            <p>City: <strong>{order.city}</strong></p>
                            <p>State: <strong>{order.state}</strong></p>
                            <p>Country: <strong>{order.country}</strong></p>
                            <p>Payment Method: <strong>{order.payment}</strong></p>
                            <p>Total: <strong>{order.total}</strong></p>
                            <p>Order Date: <strong>{new Date(order.orderDate).toLocaleString()}</strong></p>
                            <p>Status: <strong>{order.status}</strong></p>
                            <h3 className="text-lg font-semibold mt-6 mb-2">Cart Items</h3>
                            <ul>
                              {order.cartitems?.map((item) => (
                                <li className="flex items-center gap-2" key={`${order._id}-${item.image}`}>
                                  {item?.title || "No Title"}
                                  {item?.image && (
                                    <Image src={urlFor(item.image).url()} alt={item.title || "No Image"} width={100} height={100} />
                                  )}
                                </li>
                              )) || <p>No items in cart</p>}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ProtectedRoutpage>
    </>
  );
}