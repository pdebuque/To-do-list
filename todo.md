base

create a task
[x] html structure
[x] set up database
[x] set up POST: add a task
[x] set up GET: download all tasks
[x] front-end show all results
[x] PUT: update done
[x] DELETE: delete task
[] styling: update when task done
[] styling: style the display
    [] parse date info
    [] fonts

[] styling: update the header

[] sort incoming data by importance


[] data validation


STRETCH
[] tasks go into different columns for to-do and complete
    [] to-do sorted by importance
    [] tasks can be moved to and from using toggle done


[x] sort by importance
[x] sort by date
    [x] separate render into two functions. default called by both but called separately in sort
    [x] create two separate get functions for sort
    [x] click listeners on dom to sort

time completed
[x] new column in database: time_completed

[x] saving the time
    [x] click 'mark as done' button --> fetch current time
    [x] put request saves this time to time_completed
    [x] rendering complete includes this time
[x] unsaving the time
    [x] click 'mark not done' button --> put request clear the time_completed
    [x] render incomplete is the same

[] consolidate toggle done function for all cases

## style to-do
[] make completed tasks smaller. focus should be on incomplete
[] fiddle with fonts
[] media queries to switch layouts