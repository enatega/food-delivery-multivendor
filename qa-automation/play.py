# first we wil reverse the string and maintain another string then we will compate the strings if both are same then it is a palidrome 
variable = input("Enter a string: ")
# reverse the string and maintain another string then we will compate the strings if both are same then it is a palidrome 
def reverse_string(variable):
    return variable[::-1]

def is_palidrome(variable):
    return variable == reverse_string(variable)

if is_palidrome(variable):
    print("The string is a palidrome")
else:
    print("The string is not a palidrome")

# variable will be input by user

