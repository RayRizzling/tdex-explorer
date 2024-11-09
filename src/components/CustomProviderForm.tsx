// components/CustomProviderForm.tsx

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CustomProviderFormProps, Provider } from "@/types/types"
import { isOnion } from "@/lib/utils"

/**
 * Validation schema for the CustomProviderForm.
 * 
 * Validates the required fields `providername` and `providerurl` with Zod:
 * - `providername` requires a minimum length of 1 and a maximum length of 255 characters.
 * - `providerurl` must be a valid URL, up to 255 characters.
 */
const formSchema = z.object({
  providername: z.string()
    .min(1, { message: "Provider name is required" })
    .max(255, { message: "Provider name is too long" }),
  providerurl: z.string()
    .url({ message: "Must be a valid URL" })
    .max(255),
})

/**
 * Form component for adding custom providers with validation and error handling.
 * Accepts two props:
 * - `onAddProvider`: Callback function to handle the addition of a new provider.
 * - `searchLoading`: Boolean flag for indicating loading state during submission.
 */
export function CustomProviderForm({ onAddProvider, searchLoading }: CustomProviderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providername: "",
      providerurl: "",
    },
  })

  /**
   * Handles form submission.
   * Checks if the URL is a Tor endpoint (ends with ".onion") and
   * creates a new `Provider` object with this data. Calls `onAddProvider`
   * to pass this new provider object to the parent component.
   * @param values - Validated form values with `providername` and `providerurl`.
   */
  function onSubmit(values: z.infer<typeof formSchema>) {
    const onion = isOnion(values.providerurl)
    const newProvider: Provider = {
      name: values.providername,
      endpoint: values.providerurl,
      onion,
    }
    onAddProvider(newProvider) // Pass the new provider to parent component
    form.reset() // Reset the form fields after submission
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-secondary/30 border p-6 rounded-lg shadow-md">
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Input field for Provider Name */}
            <FormField
              control={form.control}
              name="providername"
              render={({ field }) => (
                <FormItem>
                  <FormDescription className="text-center mb-2 font-lg text-md">
                    Add custom providers
                  </FormDescription>
                  <FormLabel htmlFor="providername">Name</FormLabel>
                  <FormControl>
                    <Input 
                      id="providername" 
                      placeholder="e.g., Example Provider" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400"/> {/* Displays validation errors for provider name */}
                </FormItem>
              )}
            />
            
            {/* Input field for Provider URL */}
            <FormField
              control={form.control}
              name="providerurl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="providerurl">URL</FormLabel>
                  <FormControl>
                    <Input 
                      id="providerurl" 
                      placeholder="e.g., http://example.com or http://example.onion" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400"/> {/* Displays validation errors for provider URL */}
                </FormItem>
              )}
            />

            {/* Submit button with loading state */}
            <div className="text-center">
              <Button disabled={searchLoading} type="submit">
                {searchLoading ? 'Fetching...' : 'Add Provider'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
