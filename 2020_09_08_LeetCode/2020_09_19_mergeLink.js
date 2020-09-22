{
  function ListNode(val) {
    this.next = null
    this.value = val
  }
  const buidLink = (arr) => {
    const [first, ...other] = arr
    const ret = new ListNode(first)
    let temp = ret
    other.forEach((num) => {
      temp.next = new ListNode(num)
      temp = temp.next
    })
    return ret
  }
  const l1 = buidLink([1,2,4])
  const l2 = buidLink([1,3,4])
  var mergeTwoLists = function (l1, l2) {
    const head = new ListNode(0)
    let current = head
    while (l1 != null && l2 != null) {
      if (l1.value < l2.value) {
        current.next = l1
        l1 = l1.next
      } else {
        current.next = l2
        l2 = l2.next
      }
      current = current.next
    }
    current.next = l1 == null ? l2 : l1
    return head.next
  }
  console.log(mergeTwoLists(l1,l2))
}
