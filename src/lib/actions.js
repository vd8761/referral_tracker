"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- CUSTOMERS ---
export async function addCustomer(formData) {
  await prisma.customer.create({
    data: {
      companyName: formData.get("companyName"),
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
    }
  });
  revalidatePath("/customers");
}

export async function deleteCustomer(id) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customers");
}

// --- VENDORS ---
export async function addVendor(formData) {
  await prisma.vendor.create({
    data: {
      companyName: formData.get("companyName"),
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
    }
  });
  revalidatePath("/vendors");
}

export async function deleteVendor(id) {
  await prisma.vendor.delete({ where: { id } });
  revalidatePath("/vendors");
}

// --- DEALS ---
export async function addDeal(formData) {
  const dealValue = parseFloat(formData.get("dealValue"));
  const commissionType = formData.get("commissionType");
  const commissionValue = parseFloat(formData.get("commissionValue"));
  
  let commissionAmount = 0;
  if (commissionType === "PERCENTAGE") {
    commissionAmount = (dealValue * commissionValue) / 100;
  } else {
    commissionAmount = commissionValue;
  }

  const vendorIds = formData.getAll("vendorIds");

  await prisma.deal.create({
    data: {
      requirementDescription: formData.get("requirementDescription"),
      dealValue,
      commissionType,
      commissionValue,
      commissionAmount,
      dealStatus: formData.get("dealStatus"),
      commissionStatus: formData.get("commissionStatus"),
      customerId: formData.get("customerId"),
      referredVendors: {
        connect: vendorIds.map(id => ({ id }))
      }
    }
  });
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function updateDealStatus(id, dealStatus, commissionStatus, wonVendorId = undefined) {
  const data = { dealStatus, commissionStatus };
  if (wonVendorId !== undefined) {
    data.wonVendorId = wonVendorId;
  }
  await prisma.deal.update({
    where: { id },
    data
  });
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function updateDealStatusForm(dealId, currentCommissionStatus, formData) {
  const status = formData.get("dealStatus");
  let wonVendorId = formData.get("wonVendorId");
  if (!wonVendorId || wonVendorId === "") {
    wonVendorId = null;
  }
  
  await prisma.deal.update({
    where: { id: dealId },
    data: {
      dealStatus: status,
      commissionStatus: currentCommissionStatus,
      wonVendorId: wonVendorId
    }
  });
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function deleteDeal(id) {
  await prisma.deal.delete({ where: { id } });
  revalidatePath("/deals");
  revalidatePath("/");
}

// --- SETTINGS ---
export async function changePassword(currentPassword, newPassword) {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("@/lib/auth");
  const bcrypt = await import("bcryptjs");
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Incorrect current password" };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword }
  });

  return { success: true, message: "Password updated successfully" };
}
