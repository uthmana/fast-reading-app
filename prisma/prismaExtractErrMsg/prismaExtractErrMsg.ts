import { Prisma } from "@prisma/client";

export function extractPrismaErrMsg(error: any) {
  let userMessage =
    "An unexpected error occurred. Please try again or contact support.";
  let technicalMessage = error?.message || "No additional details available.";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        userMessage = "The provided value is too long for this field.";
        break;
      case "P2001":
        userMessage = "The requested record could not be found.";
        break;
      case "P2002":
        userMessage =
          "A record with this value already exists. Please use a different value.";
        break;
      case "P2003":
        userMessage =
          "Foreign key constraint failed. Ensure related records exist.";
        break;
      case "P2004":
        userMessage =
          "A database constraint was violated. Please check your input.";
        break;
      case "P2005":
        userMessage = "Invalid value provided for a field.";
        break;
      case "P2006":
        userMessage = "The data format is incorrect. Please check your inputs.";
        break;
      case "P2007":
        userMessage =
          "Data validation failed. Ensure all required fields are correct.";
        break;
      case "P2011":
        userMessage = "A required field cannot be null.";
        break;
      case "P2012":
        userMessage = "A mandatory value is missing.";
        break;
      case "P2013":
        userMessage = "A required argument is missing in the request.";
        break;
      case "P2014":
        userMessage = "Related record not found.";
        break;
      case "P2015":
        userMessage = "Record found, but relation is not valid.";
        break;
      case "P2016":
        userMessage = "Incorrect model or field name.";
        break;
      case "P2017":
        userMessage = "Records are not connected as expected.";
        break;
      case "P2018":
        userMessage = "Required connected records are missing.";
        break;
      case "P2019":
        userMessage = "Input data is too large for this field.";
        break;
      case "P2020":
        userMessage = "The value is out of range for this column.";
        break;
      case "P2021":
        userMessage = "The table or column does not exist in the database.";
        break;
      case "P2022":
        userMessage = "A required constraint was violated.";
        break;
      case "P2023":
        userMessage =
          "Database integrity violation. Data might be inconsistent.";
        break;
      case "P2024":
        userMessage = "The database query took too long and was timed out.";
        break;
      case "P2025":
        userMessage =
          "The record you are trying to update or delete does not exist.";
        break;
      case "P2026":
        userMessage =
          "This database does not support the requested Prisma feature.";
        break;
      case "P2027":
        userMessage = "Multiple errors occurred while processing the request.";
        break;
      case "P2030":
        userMessage = "Error parsing JSON data.";
        break;
      case "P2031":
        userMessage = "Transaction failed due to a missing transaction ID.";
        break;
      case "P2033":
        userMessage = "Column type mismatch in the database.";
        break;
      default:
        userMessage = `A database error occurred (Code: ${error.code}). Please try again.`;
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    userMessage = "Invalid data provided. Please check your inputs.";
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    userMessage = "A critical database error occurred. Please try again later.";
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    userMessage = "An unknown error occurred while processing your request.";
  }

  return {
    userMessage,
    technicalMessage,
  };
}
